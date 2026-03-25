/**
 * POST /api/bookings - Create a new booking
 * GET /api/bookings - Get user's bookings
 * PATCH /api/bookings/[id] - Update booking (cancel)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createBooking, getUserBookings } from "@/lib/services/bookingService";
import { createBookingSchema } from "@/lib/validations";
import { createErrorResponse, UnauthorizedError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      throw new UnauthorizedError("You must be logged in to book a trek");
    }

    const body = await request.json();

    // Validate booking data
    const validatedData = createBookingSchema.parse(body);

    // Create booking with transaction
    const booking = await createBooking(
      userId,
      validatedData.departureId,
      validatedData.numberOfPeople,
      validatedData.contactName,
      validatedData.contactPhone,
      validatedData.contactEmail,
    );

    return NextResponse.json(
      {
        success: true,
        data: booking,
        message: "Booking created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      throw new UnauthorizedError();
    }

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    const result = await getUserBookings(userId, page, limit);

    return NextResponse.json({
      success: true,
      data: result.bookings,
      pagination: result.pagination,
    });
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: error instanceof UnauthorizedError ? 401 : 500,
    });
  }
}
