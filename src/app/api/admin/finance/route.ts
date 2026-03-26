import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiRole } from "@/lib/apiAuth";
import {
  getAdminFinanceSummary,
  parseAdminFinancePeriod,
} from "@/lib/services/adminDashboardService";
import { randomUUID } from "node:crypto";

// GET /api/admin/finance - Get finance summary
export async function GET(request: Request) {
  const { response } = await requireApiRole("ADMIN");

  if (response) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const data = await getAdminFinanceSummary(
      parseAdminFinancePeriod(searchParams.get("period")),
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching finance data:", error);
    return NextResponse.json(
      { error: "Failed to fetch finance data" },
      { status: 500 },
    );
  }
}

// POST /api/admin/finance/payouts - Process trek leader payout
export async function POST(request: Request) {
  const { response } = await requireApiRole("ADMIN");

  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const { payoutId, status, paymentMethod, transactionId, notes } = body;

    if (payoutId) {
      // Update existing payout
      const payout = await prisma.trekLeaderPayout.update({
        where: { id: payoutId },
        data: {
          status,
          paymentMethod,
          transactionId,
          notes,
          paidAt: status === "PAID" ? new Date() : null,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        payout,
      });
    }

    // Create new payout
    const { trekLeaderId, departureId, amount } = body;

    const payout = await prisma.trekLeaderPayout.create({
      data: {
        id: randomUUID(),
        trekLeaderId,
        departureId,
        amount: parseInt(amount),
        status: "PENDING",
        notes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        payout,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error processing payout:", error);
    return NextResponse.json(
      { error: "Failed to process payout" },
      { status: 500 },
    );
  }
}
