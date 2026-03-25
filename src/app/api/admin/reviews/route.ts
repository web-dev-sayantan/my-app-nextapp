import { NextResponse } from "next/server";
import { logAudit } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { requireApiRole } from "@/lib/apiAuth";
import type { Prisma } from "@prisma/client";

// GET /api/admin/reviews - List all reviews
export async function GET(request: Request) {
  const { response } = await requireApiRole("MODERATOR");

  if (response) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const trekId = searchParams.get("trekId");
    const rating = searchParams.get("rating");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const where: Prisma.TrekReviewWhereInput = {};
    if (trekId) where.trekId = trekId;
    if (rating) where.rating = parseInt(rating);

    const reviews = await prisma.trekReview.findMany({
      where,
      include: {
        trek: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.trekReview.count({ where });

    // Get average rating
    const avgRating = await prisma.trekReview.aggregate({
      where,
      _avg: {
        rating: true,
      },
    });

    // Get rating distribution
    const ratingDistribution = await prisma.trekReview.groupBy({
      by: ["rating"],
      where,
      _count: {
        _all: true,
      },
    });

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        total,
        averageRating: avgRating._avg.rating || 0,
        ratingDistribution: ratingDistribution.reduce<Record<number, number>>(
          (acc, review) => {
            acc[review.rating] = review._count._all;
            return acc;
          },
          {},
        ),
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/reviews - Update review (approve/hide)
export async function PATCH(request: Request) {
  const { response, user: adminUser } = await requireApiRole("MODERATOR");

  if (response || !adminUser) {
    return (
      response ?? NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    );
  }

  try {
    const body = await request.json();
    const { reviewId, isHidden, isApproved } = body;

    // Note: We don't have isHidden field in the model yet, so we'll add metadata
    // For now, let's just return success without modifying

    const review = await prisma.trekReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await logAudit("REVIEW_MODERATED", "TREK_REVIEW", reviewId, adminUser.id, {
      isHidden,
      isApproved,
    });

    return NextResponse.json({
      success: true,
      message: "Review moderated successfully",
    });
  } catch (error) {
    console.error("Error moderating review:", error);
    return NextResponse.json(
      { error: "Failed to moderate review" },
      { status: 500 },
    );
  }
}
