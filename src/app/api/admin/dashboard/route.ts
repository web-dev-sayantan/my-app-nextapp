import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/apiAuth";
import { getAdminDashboardOverview } from "@/lib/adminDashboard";

// GET /api/admin/dashboard/overview - Get dashboard overview stats
export async function GET(request: Request) {
  const { response } = await requireApiRole("MODERATOR");

  if (response) {
    return response;
  }

  try {
    const data = await getAdminDashboardOverview();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard overview" },
      { status: 500 },
    );
  }
}
