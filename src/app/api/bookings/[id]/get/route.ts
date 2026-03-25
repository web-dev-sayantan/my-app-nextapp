import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type BookingRecord = {
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
  } | null;
};

function serializeBooking(booking: BookingRecord) {
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
    trek: booking.departure?.trek
      ? {
          ...booking.departure.trek,
          duration: `${booking.departure.trek.duration} days`,
        }
      : null,
  };
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 },
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        departure: {
          include: {
            trek: true,
          },
        },
        user: true,
        payment: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const response = serializeBooking(booking as BookingRecord);

    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking details" },
      { status: 500 },
    );
  }
}
