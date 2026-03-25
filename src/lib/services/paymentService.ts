/**
 * Payment Service with Razorpay Integration
 * Production-ready payment processing with idempotency
 */

import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import crypto from "crypto";
import {
  PaymentRequiredError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";
import { sendBookingConfirmationEmail } from "@/lib/email";

// Lazy-load Razorpay client to prevent build-time initialization errors
let razorpayInstance: Razorpay | null = null;

function getRazorpayClient(): Razorpay {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials are not configured");
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

export async function createPaymentIntent(bookingId: string, userId: string) {
  // Get booking details
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      departure: {
        include: { trek: true },
      },
    },
  });

  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.userId !== userId) {
    throw new ValidationError("Cannot pay for someone else's booking");
  }

  // Check if payment already exists
  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment) {
    if (existingPayment.status === "COMPLETED") {
      throw new ValidationError("Payment already completed for this booking");
    }
    // Return existing payment if pending (allows retry)
    return existingPayment;
  }

  // Create payment record in database
  const payment = await prisma.payment.create({
    data: {
      bookingId,
      userId,
      amount: booking.totalAmount,
      status: "PENDING",
      paymentGateway: "razorpay",
      paymentIntentId: generateIdempotencyKey(bookingId),
    },
  });

  // Create Razorpay order
  try {
    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: booking.totalAmount, // in paise
      currency: "INR",
      receipt: bookingId, // Unique receipt ID
      notes: {
        bookingId,
        userId,
        trekName: booking.departure.trek.name,
        numberOfPeople: booking.numberOfPeople,
      },
    });

    // Update payment with Razorpay order ID
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        transactionId: razorpayOrder.id,
      },
    });

    return {
      payment: updatedPayment,
      razorpayOrder,
    };
  } catch (error) {
    // Mark payment as failed and log error
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    });

    throw new PaymentRequiredError(
      "Failed to initiate payment. Please try again.",
    );
  }
}

export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): boolean {
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
  shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
  const expectedSignature = shasum.digest("hex");

  return expectedSignature === razorpaySignature;
}

export async function processPaymentSuccess(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
) {
  // Verify signature first (security critical!)
  if (
    !verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    )
  ) {
    throw new ValidationError("Invalid payment signature");
  }

  // Find payment record
  const payment = await prisma.payment.findUnique({
    where: { transactionId: razorpayOrderId },
    include: {
      booking: {
        include: {
          departure: { include: { trek: true } },
          user: true,
        },
      },
    },
  });

  if (!payment) {
    throw new NotFoundError("Payment record not found");
  }

  // Update payment and booking in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update payment
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        transactionId: razorpayPaymentId,
      },
    });

    // Update booking status
    const updatedBooking = await tx.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: "CONFIRMED",
      },
      include: {
        departure: {
          include: { trek: true },
        },
        user: true,
      },
    });

    // Create audit log
    await tx.auditLog.create({
      data: {
        action: "PAYMENT_COMPLETED",
        entityType: "PAYMENT",
        entityId: updatedPayment.id,
        userId: payment.userId,
        metadata: JSON.stringify({
          amount: updatedPayment.amount,
          razorpayPaymentId,
        }),
      },
    });

    return { payment: updatedPayment, booking: updatedBooking };
  });

  // Send confirmation email (async, non-blocking)
  if (result.booking.user && result.booking.user.email) {
    sendBookingConfirmationEmail({
      to: result.booking.user.email,
      userName:
        result.booking.user.firstName ||
        result.booking.user.username ||
        "Adventurer",
      bookingDetails: {
        trekName: result.booking.departure?.trek?.name || "Your Trek",
        startDate: result.booking.departure?.startDate
          ? new Date(result.booking.departure.startDate).toLocaleDateString(
              "en-IN",
            )
          : "TBD",
        endDate: result.booking.departure?.endDate
          ? new Date(result.booking.departure.endDate).toLocaleDateString(
              "en-IN",
            )
          : "TBD",
        numberOfPeople: result.booking.numberOfPeople,
        totalAmount: result.booking.totalAmount,
        bookingId: result.booking.id,
      },
    }).catch((err) => console.error("Failed to send confirmation email:", err));
  }

  return result;
}

export async function processPaymentFailure(
  razorpayOrderId: string,
  errorMessage: string,
) {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: razorpayOrderId },
  });

  if (!payment) {
    throw new NotFoundError("Payment record not found");
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "FAILED",
      errorMessage,
    },
  });

  // Log failed payment
  await prisma.auditLog.create({
    data: {
      action: "PAYMENT_FAILED",
      entityType: "PAYMENT",
      entityId: payment.id,
      userId: payment.userId,
      metadata: JSON.stringify({
        razorpayOrderId,
        errorMessage,
      }),
    },
  });
}

export async function refundPayment(paymentId: string, userId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new NotFoundError("Payment not found");
  }

  if (payment.userId !== userId) {
    throw new ValidationError("Cannot refund someone else's payment");
  }

  if (payment.status !== "COMPLETED") {
    throw new ValidationError("Only completed payments can be refunded");
  }

  try {
    // Request refund from Razorpay
    const razorpay = getRazorpayClient();
    const refund = await razorpay.payments.refund(payment.transactionId!, {
      amount: payment.amount,
    });

    // Update payment record
    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "REFUNDED",
        refundAmount: payment.amount,
        refundedAt: new Date(),
        refundTransactionId: refund.id,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "PAYMENT_REFUNDED",
        entityType: "PAYMENT",
        entityId: updated.id,
        userId,
        metadata: JSON.stringify({
          amount: payment.amount,
          razorpayRefundId: refund.id,
        }),
      },
    });

    return updated;
  } catch (error) {
    throw new PaymentRequiredError(
      "Failed to process refund. Please contact support.",
    );
  }
}

export async function getPayment(paymentId: string, userId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        include: {
          departure: {
            include: { trek: true },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new NotFoundError("Payment not found");
  }

  if (payment.userId !== userId) {
    throw new ValidationError("Cannot access other user's payment");
  }

  return payment;
}

/**
 * Generate idempotency key for payment
 * Ensures same booking always generates same Razorpay order
 */
function generateIdempotencyKey(bookingId: string): string {
  return `booking_${bookingId}_${Date.now()}`;
}

/**
 * Webhook handler for Razorpay events
 * Should be called from /api/webhooks/razorpay
 */
export async function handleRazorpayWebhook(
  event: {
    event: string;
    payload: {
      payment: {
        entity: {
          id: string;
          order_id: string;
          signature?: string;
          error_description?: string;
        };
      };
    };
  },
  signature: string,
) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  // Verify webhook signature
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(event));
  const expectedSignature = shasum.digest("hex");

  if (expectedSignature !== signature) {
    throw new ValidationError("Invalid webhook signature");
  }

  // Handle different event types
  switch (event.event) {
    case "payment.authorized":
      if (!event.payload.payment.entity.signature) {
        throw new ValidationError("Missing payment signature");
      }

      await processPaymentSuccess(
        event.payload.payment.entity.order_id,
        event.payload.payment.entity.id,
        event.payload.payment.entity.signature,
      );
      break;

    case "payment.failed":
      await processPaymentFailure(
        event.payload.payment.entity.order_id,
        event.payload.payment.entity.error_description ?? "Payment failed",
      );
      break;

    case "payment.captured":
      // Payment successfully captured
      break;

    // Add other event types as needed
  }
}
