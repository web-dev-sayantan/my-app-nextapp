import { NextResponse } from "next/server";
import { logAudit } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { requireApiRole } from "@/lib/apiAuth";
import type { Prisma } from "@prisma/client";

// GET /api/admin/participants - List all participants
export async function GET(request: Request) {
  const { response } = await requireApiRole("MODERATOR");

  if (response) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter"); // all, upcoming, repeat, past
    const paymentStatus = searchParams.get("paymentStatus"); // paid, partial, pending
    const medicalStatus = searchParams.get("medicalStatus"); // submitted, pending
    const idVerified = searchParams.get("idVerified"); // true, false
    const waiverSigned = searchParams.get("waiverSigned"); // true, false
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const search = searchParams.get("search");

    const now = new Date();
    const conditions: Prisma.BookingWhereInput[] = [];

    if (filter === "upcoming") {
      conditions.push({
        departure: {
          is: {
            startDate: { gte: now },
          },
        },
        status: { in: ["PENDING", "CONFIRMED"] },
      });
    } else if (filter === "past") {
      conditions.push({
        departure: {
          is: {
            endDate: { lt: now },
          },
        },
        status: "COMPLETED",
      });
    } else if (filter === "repeat") {
      conditions.push({
        isRepeatTrekker: true,
      });
    }

    if (paymentStatus === "paid") {
      conditions.push({
        payment: {
          is: {
            status: "COMPLETED",
          },
        },
      });
    } else if (paymentStatus === "pending") {
      conditions.push({
        OR: [
          {
            payment: {
              is: null,
            },
          },
          {
            payment: {
              is: {
                status: "PENDING",
              },
            },
          },
        ],
      });
    }

    if (medicalStatus === "submitted") {
      conditions.push({ medicalFormSubmitted: true });
    } else if (medicalStatus === "pending") {
      conditions.push({ medicalFormSubmitted: false });
    }

    if (idVerified === "true") {
      conditions.push({ idVerified: true });
    } else if (idVerified === "false") {
      conditions.push({ idVerified: false });
    }

    if (waiverSigned === "true") {
      conditions.push({ waiverSigned: true });
    } else if (waiverSigned === "false") {
      conditions.push({ waiverSigned: false });
    }

    if (search) {
      conditions.push({
        OR: [
          { contactName: { contains: search, mode: "insensitive" } },
          { contactEmail: { contains: search, mode: "insensitive" } },
          { contactPhone: { contains: search, mode: "insensitive" } },
          {
            user: {
              is: {
                email: { contains: search, mode: "insensitive" },
              },
            },
          },
        ],
      });
    }

    const where: Prisma.BookingWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        departure: {
          include: {
            trek: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            advanceAmount: true,
            balanceAmount: true,
            paymentMethod: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.booking.count({ where });

    // Calculate stats
    const stats = await prisma.booking.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
      where: {
        departure: {
          is: {
            startDate: { gte: now },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      participants: bookings,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/participants - Update participant status
export async function PATCH(request: Request) {
  const { response, user: adminUser } = await requireApiRole("MODERATOR");

  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const {
      bookingId,
      medicalFormSubmitted,
      idVerified,
      idDocumentType,
      waiverSigned,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
    } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 },
      );
    }

    const updateData: Prisma.BookingUpdateInput = {};
    if (medicalFormSubmitted !== undefined) {
      updateData.medicalFormSubmitted = medicalFormSubmitted;
      if (medicalFormSubmitted) {
        updateData.medicalFormDate = new Date();
      }
    }
    if (idVerified !== undefined) {
      updateData.idVerified = idVerified;
      if (idVerified) {
        updateData.idVerificationDate = new Date();
      }
    }
    if (idDocumentType !== undefined)
      updateData.idDocumentType = idDocumentType;
    if (waiverSigned !== undefined) {
      updateData.waiverSigned = waiverSigned;
      if (waiverSigned) {
        updateData.waiverSignedDate = new Date();
      }
    }
    if (emergencyContactName !== undefined)
      updateData.emergencyContactName = emergencyContactName;
    if (emergencyContactPhone !== undefined)
      updateData.emergencyContactPhone = emergencyContactPhone;
    if (emergencyContactRelation !== undefined)
      updateData.emergencyContactRelation = emergencyContactRelation;

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    await logAudit(
      "PARTICIPANT_UPDATED",
      "BOOKING",
      booking.id,
      adminUser.id,
      updateData,
    );

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Error updating participant:", error);
    return NextResponse.json(
      { error: "Failed to update participant" },
      { status: 500 },
    );
  }
}
