import { NextResponse } from "next/server";
import { logAudit } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { requireApiRole } from "@/lib/apiAuth";

type AggregatedMarketingMetrics = {
  websiteVisitors: number;
  websitePageViews: number;
  instagramClicks: number;
  instagramImpressions: number;
  totalBookings: number;
  referralBookings: number;
  repeatCustomerBookings: number;
};

// GET /api/admin/marketing - Get marketing metrics
export async function GET(request: Request) {
  const { response } = await requireApiRole("MODERATOR");

  if (response) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";

    // Calculate date range
    const now = new Date();
    let startDate = new Date(0);

    if (period === "week") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "quarter") {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
    } else if (period === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    // Get marketing metrics
    const metrics = await prisma.marketingMetric.findMany({
      where: {
        date: { gte: startDate },
      },
      orderBy: { date: "desc" },
    });

    // Aggregate metrics
    const aggregated = metrics.reduce<AggregatedMarketingMetrics>(
      (acc, metric) => {
        acc.websiteVisitors += metric.websiteVisitors;
        acc.websitePageViews += metric.websitePageViews;
        acc.instagramClicks += metric.instagramClicks;
        acc.instagramImpressions += metric.instagramImpressions;
        acc.totalBookings += metric.totalBookings;
        acc.referralBookings += metric.referralBookings;
        acc.repeatCustomerBookings += metric.repeatCustomerBookings;
        return acc;
      },
      {
        websiteVisitors: 0,
        websitePageViews: 0,
        instagramClicks: 0,
        instagramImpressions: 0,
        totalBookings: 0,
        referralBookings: 0,
        repeatCustomerBookings: 0,
      },
    );

    // Calculate conversion rate
    const conversionRate =
      aggregated.websiteVisitors > 0
        ? (
            (aggregated.totalBookings / aggregated.websiteVisitors) *
            100
          ).toFixed(2)
        : 0;

    // Calculate repeat customer %
    const repeatCustomerPercent =
      aggregated.totalBookings > 0
        ? (
            (aggregated.repeatCustomerBookings / aggregated.totalBookings) *
            100
          ).toFixed(2)
        : 0;

    // Get top performing treks
    const topBookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      select: {
        departureId: true,
        totalAmount: true,
      },
    });

    const topTrekMap = topBookings.reduce<
      Map<string, { bookingCount: number; revenue: number }>
    >((acc, booking) => {
      const existing = acc.get(booking.departureId) || {
        bookingCount: 0,
        revenue: 0,
      };
      existing.bookingCount += 1;
      existing.revenue += booking.totalAmount;
      acc.set(booking.departureId, existing);
      return acc;
    }, new Map());

    const topTreks = Array.from(topTrekMap.entries())
      .map(([departureId, value]) => ({ departureId, ...value }))
      .sort((left, right) => right.bookingCount - left.bookingCount)
      .slice(0, 10);

    // Get trek details for each
    const topTreksWithDetails = await Promise.all(
      topTreks.map(async (trekSummary) => {
        const departure = await prisma.departure.findUnique({
          where: { id: trekSummary.departureId },
          include: {
            trek: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        });
        return {
          trekId: trekSummary.departureId,
          trekName: departure?.trek?.name || "Unknown",
          trekSlug: departure?.trek?.slug || "unknown",
          bookingCount: trekSummary.bookingCount,
          revenue: trekSummary.revenue,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: {
        websiteVisitors: aggregated.websiteVisitors,
        websitePageViews: aggregated.websitePageViews,
        conversionRate: parseFloat(conversionRate as string),
        instagramClicks: aggregated.instagramClicks,
        instagramImpressions: aggregated.instagramImpressions,
        totalBookings: aggregated.totalBookings,
        referralBookings: aggregated.referralBookings,
        repeatCustomerPercent: parseFloat(repeatCustomerPercent as string),
        topTreks: topTreksWithDetails,
        period,
      },
    });
  } catch (error) {
    console.error("Error fetching marketing data:", error);
    return NextResponse.json(
      { error: "Failed to fetch marketing data" },
      { status: 500 },
    );
  }
}

// POST /api/admin/marketing - Add/update marketing metrics
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
      date,
      websiteVisitors,
      websitePageViews,
      conversionRate,
      instagramClicks,
      instagramImpressions,
      totalBookings,
      referralBookings,
      repeatCustomerBookings,
      topTreks,
    } = body;

    const metricDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(metricDate.setHours(0, 0, 0, 0));

    // Check if metric exists for this date
    const existing = await prisma.marketingMetric.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    let metric;
    if (existing) {
      // Update existing
      metric = await prisma.marketingMetric.update({
        where: { id: existing.id },
        data: {
          websiteVisitors: websiteVisitors ?? existing.websiteVisitors,
          websitePageViews: websitePageViews ?? existing.websitePageViews,
          conversionRate: conversionRate ?? existing.conversionRate,
          instagramClicks: instagramClicks ?? existing.instagramClicks,
          instagramImpressions:
            instagramImpressions ?? existing.instagramImpressions,
          totalBookings: totalBookings ?? existing.totalBookings,
          referralBookings: referralBookings ?? existing.referralBookings,
          repeatCustomerBookings:
            repeatCustomerBookings ?? existing.repeatCustomerBookings,
          topTreks: topTreks ? JSON.stringify(topTreks) : existing.topTreks,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new
      metric = await prisma.marketingMetric.create({
        data: {
          id: startOfDay.toISOString(),
          date: startOfDay,
          websiteVisitors: websiteVisitors ?? 0,
          websitePageViews: websitePageViews ?? 0,
          conversionRate: conversionRate ?? 0,
          instagramClicks: instagramClicks ?? 0,
          instagramImpressions: instagramImpressions ?? 0,
          totalBookings: totalBookings ?? 0,
          referralBookings: referralBookings ?? 0,
          repeatCustomerBookings: repeatCustomerBookings ?? 0,
          topTreks: topTreks ? JSON.stringify(topTreks) : null,
          updatedAt: new Date(),
        },
      });
    }

    await logAudit(
      "MARKETING_METRICS_UPDATED",
      "MARKETING_METRIC",
      metric.id,
      adminUser.id,
      { date: startOfDay },
    );

    return NextResponse.json({
      success: true,
      metric,
    });
  } catch (error) {
    console.error("Error saving marketing metrics:", error);
    return NextResponse.json(
      { error: "Failed to save marketing metrics" },
      { status: 500 },
    );
  }
}
