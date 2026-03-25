/**
 * PATCH /api/bookings/[id]/cancel - Cancel booking
 * GET /api/bookings/[id] - Get booking details
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BookingService } from "@/lib/services/bookingService";
import { createErrorResponse, UnauthorizedError } from "@/lib/errors";

type BookingResponseSource = {
  id: string;
  departureId: string;
  numberOfPeople: number;
  totalAmount: number;
  status: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: Date;
  payment: {
    status: string;
  } | null;
  departure: {
    startDate: Date;
    endDate: Date;
    pricePerPerson: number;
    trek: {
      name: string;
      description: string;
      difficulty: string;
      duration: number;
    };
  };
};

function buildBookingResponse(booking: BookingResponseSource) {
  return {
    ...booking,
    paymentStatus: booking.payment?.status ?? "PENDING",
    contact: {
      name: booking.contactName,
      email: booking.contactEmail,
      phone: booking.contactPhone,
    },
    participants: [] as Array<{
      name: string;
      age: number;
      gender: string;
      emergency: string;
    }>,
    trek: {
      ...booking.departure.trek,
      duration: `${booking.departure.trek.duration} days`,
    },
  };
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      throw new UnauthorizedError();
    }

    const booking = await BookingService.getBooking(params.id, userId);
    const data = buildBookingResponse(booking as BookingResponseSource);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: error instanceof UnauthorizedError ? 401 : 400,
    });
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const action = body.action;

    if (action === "cancel") {
      const cancelled = await BookingService.cancelBooking(params.id, userId);

      return NextResponse.json({
        success: true,
        data: cancelled,
        message: "Booking cancelled successfully",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Invalid action",
          code: "INVALID_ACTION",
        },
      },
      { status: 400 },
    );
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: error instanceof UnauthorizedError ? 401 : 400,
    });
  }
}
