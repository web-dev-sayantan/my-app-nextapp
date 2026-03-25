/**
 * GET /api/treks - List all treks with filtering
 * GET /api/treks/[id] - Get single trek
 * POST /api/treks - Create trek (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  createTrek,
  getTrekBySlug,
  listTreks,
} from "@/lib/services/trekService";
import { listTreksQuerySchema } from "@/lib/validations";
import { createErrorResponse, NotFoundError } from "@/lib/errors";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get search query from URL
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    // If slug is provided, get single trek
    if (slug) {
      const trek = await getTrekBySlug(slug);
      return NextResponse.json({ success: true, data: trek });
    }

    // Otherwise, list treks with filters
    const query = {
      state: searchParams.get("state") || undefined,
      difficulty: searchParams.get("difficulty") || undefined,
      minPrice: searchParams.get("minPrice")
        ? parseInt(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice")!)
        : undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 10,
    };

    // Validate query params
    const validatedQuery = listTreksQuerySchema.parse(query);

    const result = await listTreks(validatedQuery);

    return NextResponse.json({
      success: true,
      data: result.treks,
      pagination: result.pagination,
    });
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: error instanceof Error ? 400 : 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const trek = await createTrek(body);

    return NextResponse.json({ success: true, data: trek }, { status: 201 });
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: error instanceof Error ? 400 : 500,
    });
  }
}
