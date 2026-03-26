import { NextResponse } from "next/server";
import { logAudit } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { requireApiRole } from "@/lib/apiAuth";
import {
  getAdminTreks,
  parseAdminPagination,
} from "@/lib/services/adminDashboardService";

// GET /api/admin/treks - List all treks with stats
export async function GET(request: Request) {
  const { response } = await requireApiRole("MODERATOR");

  if (response) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const pagination = parseAdminPagination(
      searchParams.get("page"),
      searchParams.get("limit"),
      20,
    );
    const data = await getAdminTreks({
      page: pagination.page,
      limit: pagination.limit,
    });

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Error fetching treks:", error);
    return NextResponse.json(
      { error: "Failed to fetch treks" },
      { status: 500 },
    );
  }
}

// POST /api/admin/treks - Create new trek
export async function POST(request: Request) {
  const { response, user: adminUser } = await requireApiRole("ADMIN");

  if (response || !adminUser) {
    return (
      response ?? NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    );
  }

  try {
    const body = await request.json();
    const {
      slug,
      name,
      description,
      longDescription,
      state,
      basePrice,
      difficulty,
      duration,
      maxAltitude,
      distance,
      bestSeason,
      imageUrl,
      thumbnailUrl,
      tags,
      itinerary,
      inclusions,
      exclusions,
      requirements,
    } = body;

    // Check if slug already exists
    const existing = await prisma.trek.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Trek with this slug already exists" },
        { status: 400 },
      );
    }

    const trek = await prisma.trek.create({
      data: {
        slug,
        name,
        description,
        longDescription,
        state,
        basePrice: parseInt(basePrice),
        difficulty,
        duration: parseInt(duration),
        maxAltitude: maxAltitude ? parseInt(maxAltitude) : null,
        distance: distance ? parseFloat(distance) : null,
        bestSeason,
        imageUrl,
        thumbnailUrl,
        tags: tags || [],
        itinerary,
        inclusions: inclusions || [],
        exclusions: exclusions || [],
        requirements: requirements || [],
      },
    });

    await logAudit("TREK_CREATED", "TREK", trek.id, adminUser.id, {
      name,
      slug,
    });

    return NextResponse.json(
      {
        success: true,
        trek,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating trek:", error);
    return NextResponse.json(
      { error: "Failed to create trek" },
      { status: 500 },
    );
  }
}
