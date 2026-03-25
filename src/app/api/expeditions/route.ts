import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const expeditions = await prisma.expedition.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      expeditions,
    });
  } catch (error) {
    console.error("Error fetching expeditions:", error);
    return NextResponse.json(
      { error: "Failed to fetch expeditions" },
      { status: 500 },
    );
  }
}
