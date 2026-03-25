import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { processPaymentSuccess } from "@/lib/services/paymentService";
import { AppError, createErrorResponse } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await request.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 },
      );
    }

    // Verify Razorpay signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    // Process payment success (finds Payment by transactionId = razorpayOrderId)
    const result = await processPaymentSuccess(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified and processed successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Payment verification failed:", error);
    if (error instanceof AppError) {
      const errorResponse = createErrorResponse(error);
      return NextResponse.json(errorResponse, {
        status: errorResponse.error.statusCode,
      });
    }
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
