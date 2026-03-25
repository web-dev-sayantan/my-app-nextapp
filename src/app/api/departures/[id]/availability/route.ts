/**
 * GET /api/departures/[id]/availability
 * Check real-time seat availability for a departure
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAvailability } from "@/lib/services/bookingService";
import { createErrorResponse } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const availability = await checkAvailability(params.id);

    return NextResponse.json({
      success: true,
      data: availability,
    });
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
