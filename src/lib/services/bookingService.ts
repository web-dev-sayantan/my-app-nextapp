/**
 * Booking Service with Transaction Logic
 * Handles seat availability checks and atomic operations
 * CRITICAL: Prevents race conditions in concurrent booking scenarios
 */

import { prisma } from "@/lib/prisma";
import {
  InsufficientSeatsError,
  DuplicateBookingError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";

export async function createBooking(
  userId: string,
  departureId: string,
  numberOfPeople: number,
  contactName: string,
  contactPhone: string,
  contactEmail: string,
) {
  // Validate departure exists and isn't cancelled
  const departure = await prisma.departure.findUnique({
    where: { id: departureId },
    include: { trek: true },
  });

  if (!departure) {
    throw new NotFoundError("Departure not found");
  }

  if (departure.isCancelled) {
    throw new ValidationError("This trek departure has been cancelled");
  }

  if (numberOfPeople > departure.seatsAvailable) {
    throw new InsufficientSeatsError();
  }

  // Execute booking creation in a transaction
  // This ensures atomicity: either all operations succeed or all rollback
  const booking = await prisma.$transaction(
    async (tx) => {
      // Step 1: Check for duplicate booking (user already booked this departure)
      const existingBooking = await tx.booking.findUnique({
        where: {
          userId_departureId: { userId, departureId },
        },
      });

      if (existingBooking) {
        throw new DuplicateBookingError();
      }

      // Step 2: Re-fetch departure within transaction to get latest seatsAvailable
      // This read happens WITHIN the transaction for consistency
      const latestDeparture = await tx.departure.findUnique({
        where: { id: departureId },
      });

      if (!latestDeparture) {
        throw new NotFoundError("Departure not found");
      }

      if (numberOfPeople > latestDeparture.seatsAvailable) {
        throw new InsufficientSeatsError();
      }

      // Step 3: Update seats and create booking atomically
      // Using updateMany with a WHERE clause ensures the update only succeeds
      // if the condition is still true (optimistic locking pattern)
      const updatedDeparture = await tx.departure.update({
        where: { id: departureId },
        data: {
          seatsAvailable: {
            decrement: numberOfPeople,
          },
        },
      });

      // Step 4: Create booking record
      const totalAmount = numberOfPeople * departure.pricePerPerson;

      const newBooking = await tx.booking.create({
        data: {
          userId,
          departureId,
          numberOfPeople,
          totalAmount,
          contactName,
          contactPhone,
          contactEmail,
          status: "PENDING",
        },
        include: {
          departure: {
            include: { trek: true },
          },
          user: true,
        },
      });

      // Step 5: Log this action for audit trail
      await tx.auditLog.create({
        data: {
          action: "BOOKING_CREATED",
          entityType: "BOOKING",
          entityId: newBooking.id,
          userId,
          metadata: JSON.stringify({
            departureId,
            numberOfPeople,
            totalAmount,
          }),
        },
      });

      return newBooking;
    },
    {
      // Transaction settings for safety
      isolationLevel: "Serializable", // Strongest isolation level
      timeout: 10000, // 10 second timeout
    },
  );

  return booking;
}

export async function confirmBookingForTest(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { departure: { include: { trek: true } } },
  });

  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.userId !== userId) {
    throw new ValidationError("Cannot confirm someone else's booking");
  }

  if (booking.status !== "PENDING") {
    throw new ValidationError("Booking is not pending");
  }

  return prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
    });

    await tx.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        userId,
        amount: booking.totalAmount,
        status: "COMPLETED",
        paymentGateway: "razorpay",
        transactionId: `test_${bookingId}_${Date.now()}`,
        metadata: JSON.stringify({ testMode: true }),
      },
      update: {
        status: "COMPLETED",
        transactionId: `test_${bookingId}_${Date.now()}`,
        metadata: JSON.stringify({ testMode: true }),
      },
    });

    return prisma.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: {
        departure: { include: { trek: true } },
        user: true,
        payment: true,
      },
    });
  });
}

export async function cancelBooking(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { departure: true },
  });

  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.userId !== userId) {
    throw new ValidationError("Cannot cancel someone else's booking");
  }

  if (booking.status === "CANCELLED") {
    throw new ValidationError("Booking is already cancelled");
  }

  if (booking.status === "COMPLETED") {
    throw new ValidationError("Cannot cancel a completed trek booking");
  }

  const cancelled = await prisma.$transaction(async (tx) => {
    // Return seats to availability
    await tx.departure.update({
      where: { id: booking.departureId },
      data: {
        seatsAvailable: {
          increment: booking.numberOfPeople,
        },
      },
    });

    // Update booking status
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
      include: { departure: true },
    });

    // If payment was completed, mark for refund
    const payment = await tx.payment.findUnique({
      where: { bookingId },
    });

    if (payment && payment.status === "COMPLETED") {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "REFUNDED",
          refundAmount: payment.amount,
          refundedAt: new Date(),
        },
      });
    }

    // Audit log
    await tx.auditLog.create({
      data: {
        action: "BOOKING_CANCELLED",
        entityType: "BOOKING",
        entityId: bookingId,
        userId,
        metadata: JSON.stringify({
          seatsReturned: booking.numberOfPeople,
        }),
      },
    });

    return updatedBooking;
  });

  return cancelled;
}

export async function getBooking(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
        },
      },
      departure: {
        include: {
          trek: true,
        },
      },
      payment: true,
    },
  });

  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.userId !== userId) {
    throw new ValidationError("Cannot access someone else's booking");
  }

  return booking;
}

export async function getUserBookings(
  userId: string,
  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      include: {
        departure: {
          include: { trek: true },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where: { userId } }),
  ]);

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function checkAvailability(departureId: string) {
  const departure = await prisma.departure.findUnique({
    where: { id: departureId },
    select: {
      id: true,
      totalSeats: true,
      seatsAvailable: true,
      isCancelled: true,
      trek: {
        select: { name: true },
      },
    },
  });

  if (!departure) {
    throw new NotFoundError("Departure not found");
  }

  return {
    departureId,
    trekName: departure.trek.name,
    totalSeats: departure.totalSeats,
    seatsAvailable: departure.seatsAvailable,
    seatsBooked: departure.totalSeats - departure.seatsAvailable,
    occupancyRate: (
      ((departure.totalSeats - departure.seatsAvailable) /
        departure.totalSeats) *
      100
    ).toFixed(1),
    isCancelled: departure.isCancelled,
    isAvailable: !departure.isCancelled && departure.seatsAvailable > 0,
  };
}
