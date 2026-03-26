import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AdminFinancePeriod = "month" | "quarter" | "year" | "all";
export type AdminMarketingPeriod = "week" | "month" | "quarter" | "year";

export interface DashboardStats {
  totalBookingsThisMonth: number;
  revenueThisMonth: number;
  upcomingTreksNext30Days: number;
  occupancyRate: number;
  cancellationRate: number;
  refundPending: number;
}

export interface AdminFinanceSummary {
  totalRevenue: number;
  advanceCollected: number;
  balancePending: number;
  gstCollected: number;
  paymentMethodSplit: { method: string; amount: number; count: number }[];
  trekLeaderPayouts: {
    pending: number;
    paid: number;
    pendingCount: number;
    paidCount: number;
  };
}

export interface AdminParticipantsQuery {
  filter?: string | null;
  paymentStatus?: string | null;
  medicalStatus?: string | null;
  idVerified?: string | null;
  waiverSigned?: string | null;
  page?: number;
  limit?: number;
  search?: string | null;
}

export interface AdminTreksQuery {
  page?: number;
  limit?: number;
}

export interface AdminMarketingSummary {
  websiteVisitors: number;
  websitePageViews: number;
  conversionRate: number;
  instagramClicks: number;
  instagramImpressions: number;
  totalBookings: number;
  referralBookings: number;
  repeatCustomerPercent: number;
  topTreks: {
    trekId: string;
    trekName: string;
    trekSlug: string;
    bookingCount: number;
    revenue: number;
  }[];
  period: AdminMarketingPeriod;
}

type AggregatedMarketingMetrics = {
  websiteVisitors: number;
  websitePageViews: number;
  instagramClicks: number;
  instagramImpressions: number;
  totalBookings: number;
  referralBookings: number;
  repeatCustomerBookings: number;
};

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsedValue = Number.parseInt(value || "", 10);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

export function parseAdminFinancePeriod(
  value: string | null,
): AdminFinancePeriod {
  return value === "month" ||
    value === "quarter" ||
    value === "year" ||
    value === "all"
    ? value
    : "all";
}

export function parseAdminMarketingPeriod(
  value: string | null,
): AdminMarketingPeriod {
  return value === "week" ||
    value === "month" ||
    value === "quarter" ||
    value === "year"
    ? value
    : "month";
}

export function parseAdminPagination(
  pageValue: string | null,
  limitValue: string | null,
  defaultLimit: number,
) {
  return {
    page: parsePositiveInteger(pageValue, 1),
    limit: parsePositiveInteger(limitValue, defaultLimit),
  };
}

function getPeriodStartDate(period: AdminFinancePeriod): Date {
  const now = new Date();

  if (period === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  if (period === "quarter") {
    const quarter = Math.floor(now.getMonth() / 3);
    return new Date(now.getFullYear(), quarter * 3, 1);
  }

  if (period === "year") {
    return new Date(now.getFullYear(), 0, 1);
  }

  return new Date(0);
}

function getMarketingStartDate(period: AdminMarketingPeriod): Date {
  const now = new Date();

  if (period === "week") {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return getPeriodStartDate(period);
}

function buildParticipantWhere(
  query: AdminParticipantsQuery,
  now: Date,
): Prisma.BookingWhereInput {
  const conditions: Prisma.BookingWhereInput[] = [];

  if (query.filter === "upcoming") {
    conditions.push({
      departure: {
        is: {
          startDate: { gte: now },
        },
      },
      status: { in: ["PENDING", "CONFIRMED"] },
    });
  } else if (query.filter === "past") {
    conditions.push({
      departure: {
        is: {
          endDate: { lt: now },
        },
      },
      status: "COMPLETED",
    });
  } else if (query.filter === "repeat") {
    conditions.push({
      isRepeatTrekker: true,
    });
  }

  if (query.paymentStatus === "paid") {
    conditions.push({
      payment: {
        is: {
          status: "COMPLETED",
        },
      },
    });
  } else if (query.paymentStatus === "pending") {
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

  if (query.medicalStatus === "submitted") {
    conditions.push({ medicalFormSubmitted: true });
  } else if (query.medicalStatus === "pending") {
    conditions.push({ medicalFormSubmitted: false });
  }

  if (query.idVerified === "true") {
    conditions.push({ idVerified: true });
  } else if (query.idVerified === "false") {
    conditions.push({ idVerified: false });
  }

  if (query.waiverSigned === "true") {
    conditions.push({ waiverSigned: true });
  } else if (query.waiverSigned === "false") {
    conditions.push({ waiverSigned: false });
  }

  if (query.search) {
    conditions.push({
      OR: [
        { contactName: { contains: query.search, mode: "insensitive" } },
        { contactEmail: { contains: query.search, mode: "insensitive" } },
        { contactPhone: { contains: query.search, mode: "insensitive" } },
        {
          user: {
            is: {
              email: { contains: query.search, mode: "insensitive" },
            },
          },
        },
      ],
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}

export async function getAdminDashboardOverview(): Promise<DashboardStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    thisMonthBookings,
    thisMonthRevenue,
    upcomingTreks,
    totalBookings,
    cancelledBookings,
    pendingRefunds,
    departures,
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.departure.count({
      where: {
        startDate: {
          gte: now,
          lte: next30Days,
        },
        isCancelled: false,
      },
    }),
    prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    }),
    prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: "CANCELLED",
      },
    }),
    prisma.payment.aggregate({
      where: {
        status: "REFUNDED",
        refundedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        refundAmount: true,
      },
    }),
    prisma.departure.findMany({
      where: {
        startDate: {
          gte: now,
        },
        isCancelled: false,
      },
      select: {
        totalSeats: true,
        seatsAvailable: true,
      },
    }),
  ]);

  const totalSeats = departures.reduce(
    (sum, departure) => sum + departure.totalSeats,
    0,
  );
  const bookedSeats = departures.reduce(
    (sum, departure) => sum + (departure.totalSeats - departure.seatsAvailable),
    0,
  );

  return {
    totalBookingsThisMonth: thisMonthBookings,
    revenueThisMonth: thisMonthRevenue._sum.amount || 0,
    upcomingTreksNext30Days: upcomingTreks,
    occupancyRate:
      totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0,
    cancellationRate:
      totalBookings > 0
        ? Math.round((cancelledBookings / totalBookings) * 100)
        : 0,
    refundPending: pendingRefunds._sum.refundAmount || 0,
  };
}

export async function getAdminFinanceSummary(
  period: AdminFinancePeriod = "all",
): Promise<AdminFinanceSummary> {
  const startDate = getPeriodStartDate(period);

  const [revenue, advance, balance, gst, paymentsByMethod, trekLeaderPayouts] =
    await Promise.all([
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: startDate },
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          advanceAmount: { not: null },
          createdAt: { gte: startDate },
        },
        _sum: {
          advanceAmount: true,
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: { in: ["PENDING", "COMPLETED"] },
          balanceAmount: { not: null },
          createdAt: { gte: startDate },
        },
        _sum: {
          balanceAmount: true,
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          gstAmount: { not: null },
          createdAt: { gte: startDate },
        },
        _sum: {
          gstAmount: true,
        },
      }),
      prisma.payment.groupBy({
        by: ["paymentMethod"],
        where: {
          status: "COMPLETED",
          createdAt: { gte: startDate },
        },
        _sum: {
          amount: true,
        },
        _count: {
          _all: true,
        },
      }),
      prisma.trekLeaderPayout.groupBy({
        by: ["status"],
        where: {
          createdAt: { gte: startDate },
        },
        _sum: {
          amount: true,
        },
        _count: {
          _all: true,
        },
      }),
    ]);

  const pendingPayouts = trekLeaderPayouts.find(
    (payout) => payout.status === "PENDING",
  );
  const paidPayouts = trekLeaderPayouts.find(
    (payout) => payout.status === "PAID",
  );

  return {
    totalRevenue: revenue._sum.amount || 0,
    advanceCollected: advance._sum.advanceAmount || 0,
    balancePending: balance._sum.balanceAmount || 0,
    gstCollected: gst._sum.gstAmount || 0,
    paymentMethodSplit: paymentsByMethod.map((payment) => ({
      method: payment.paymentMethod || "unknown",
      amount: payment._sum.amount || 0,
      count: payment._count._all,
    })),
    trekLeaderPayouts: {
      pending: pendingPayouts?._sum.amount || 0,
      paid: paidPayouts?._sum.amount || 0,
      pendingCount: pendingPayouts?._count._all || 0,
      paidCount: paidPayouts?._count._all || 0,
    },
  };
}

export async function getAdminParticipants(query: AdminParticipantsQuery) {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = Math.min(
    query.limit && query.limit > 0 ? query.limit : 20,
    100,
  );
  const now = new Date();
  const where = buildParticipantWhere(query, now);

  const [participants, total, stats] = await Promise.all([
    prisma.booking.findMany({
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
    }),
    prisma.booking.count({ where }),
    prisma.booking.groupBy({
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
    }),
  ]);

  return {
    participants,
    stats,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getAdminTreks(query: AdminTreksQuery) {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = Math.min(
    query.limit && query.limit > 0 ? query.limit : 20,
    100,
  );

  const [treks, total] = await Promise.all([
    prisma.trek.findMany({
      include: {
        departures: {
          where: {
            startDate: { gte: new Date() },
            isCancelled: false,
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalSeats: true,
            seatsAvailable: true,
            waitlistCount: true,
            status: true,
            User: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.trek.count(),
  ]);

  const normalizedTreks = treks.map((trek) => ({
    ...trek,
    departures: trek.departures.map((departure) => ({
      ...departure,
      trekLeader: departure.User,
      User: undefined,
    })),
  }));

  return {
    treks: normalizedTreks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getAdminMarketingSummary(
  period: AdminMarketingPeriod = "month",
): Promise<AdminMarketingSummary> {
  const startDate = getMarketingStartDate(period);

  const [metrics, topBookings] = await Promise.all([
    prisma.marketingMetric.findMany({
      where: {
        date: { gte: startDate },
      },
      orderBy: { date: "desc" },
    }),
    prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      select: {
        departureId: true,
        totalAmount: true,
      },
    }),
  ]);

  const aggregated = metrics.reduce<AggregatedMarketingMetrics>(
    (accumulator, metric) => {
      accumulator.websiteVisitors += metric.websiteVisitors;
      accumulator.websitePageViews += metric.websitePageViews;
      accumulator.instagramClicks += metric.instagramClicks;
      accumulator.instagramImpressions += metric.instagramImpressions;
      accumulator.totalBookings += metric.totalBookings;
      accumulator.referralBookings += metric.referralBookings;
      accumulator.repeatCustomerBookings += metric.repeatCustomerBookings;
      return accumulator;
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

  const topTrekMap = topBookings.reduce<
    Map<string, { bookingCount: number; revenue: number }>
  >((accumulator, booking) => {
    const existing = accumulator.get(booking.departureId) || {
      bookingCount: 0,
      revenue: 0,
    };

    existing.bookingCount += 1;
    existing.revenue += booking.totalAmount;
    accumulator.set(booking.departureId, existing);

    return accumulator;
  }, new Map());

  const topTreks = Array.from(topTrekMap.entries())
    .map(([departureId, value]) => ({ departureId, ...value }))
    .sort((left, right) => right.bookingCount - left.bookingCount)
    .slice(0, 10);

  const departureDetails = await prisma.departure.findMany({
    where: {
      id: {
        in: topTreks.map((trek) => trek.departureId),
      },
    },
    include: {
      trek: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  const departuresById = new Map(
    departureDetails.map((departure) => [departure.id, departure]),
  );

  return {
    websiteVisitors: aggregated.websiteVisitors,
    websitePageViews: aggregated.websitePageViews,
    conversionRate:
      aggregated.websiteVisitors > 0
        ? Number(
            (
              (aggregated.totalBookings / aggregated.websiteVisitors) *
              100
            ).toFixed(2),
          )
        : 0,
    instagramClicks: aggregated.instagramClicks,
    instagramImpressions: aggregated.instagramImpressions,
    totalBookings: aggregated.totalBookings,
    referralBookings: aggregated.referralBookings,
    repeatCustomerPercent:
      aggregated.totalBookings > 0
        ? Number(
            (
              (aggregated.repeatCustomerBookings / aggregated.totalBookings) *
              100
            ).toFixed(2),
          )
        : 0,
    topTreks: topTreks.map((trekSummary) => {
      const departure = departuresById.get(trekSummary.departureId);

      return {
        trekId: trekSummary.departureId,
        trekName: departure?.trek?.name || "Unknown",
        trekSlug: departure?.trek?.slug || "unknown",
        bookingCount: trekSummary.bookingCount,
        revenue: trekSummary.revenue,
      };
    }),
    period,
  };
}
