import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params;
  try {
    const expedition = await prisma.expedition.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        sessions: {
          where: {
            startDate: {
              gte: new Date(),
            },
            isCancelled: false,
          },
          orderBy: {
            startDate: "asc",
          },
        },
      },
    });

    if (!expedition) {
      return NextResponse.json(
        { error: "Expedition not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      expedition,
    });
  } catch (error) {
    console.error("Error fetching expedition:", error);
    return NextResponse.json(
      { error: "Failed to fetch expedition" },
      { status: 500 },
    );
  }
}
