/**
 * PATCH /api/bookings/[id]/cancel - Cancel booking
 * GET /api/bookings/[id] - Get booking details
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BookingService } from "@/lib/services/bookingService";
import { createErrorResponse, UnauthorizedError } from "@/lib/errors";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      throw new UnauthorizedError();
    }

    const booking = await BookingService.getBooking(params.id, userId);

    // Shape for confirmation page: contact object, trek.duration as string
    const b = booking as any;
    const data = {
      ...b,
      contact: {
        name: b.contactName,
        email: b.contactEmail,
        phone: b.contactPhone,
      },
      trek: b.departure?.trek
        ? {
            ...b.departure.trek,
            duration: `${b.departure.trek.duration} days`,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(
      errorResponse,
      { status: error instanceof UnauthorizedError ? 401 : 400 }
    );
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
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
      { status: 400 }
    );
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(
      errorResponse,
      { status: error instanceof UnauthorizedError ? 401 : 400 }
    );
  }
}
