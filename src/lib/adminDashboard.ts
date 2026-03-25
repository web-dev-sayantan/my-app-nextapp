import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  totalBookingsThisMonth: number;
  revenueThisMonth: number;
  upcomingTreksNext30Days: number;
  occupancyRate: number;
  cancellationRate: number;
  refundPending: number;
}

export async function getAdminDashboardOverview(): Promise<DashboardStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const thisMonthBookings = await prisma.booking.count({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: { not: "CANCELLED" },
    },
  });

  const thisMonthRevenue = await prisma.payment.aggregate({
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
  });

  const upcomingTreks = await prisma.departure.count({
    where: {
      startDate: {
        gte: now,
        lte: next30Days,
      },
      isCancelled: false,
    },
  });

  const departures = await prisma.departure.findMany({
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
  });

  const totalSeats = departures.reduce(
    (sum, departure) => sum + departure.totalSeats,
    0,
  );
  const bookedSeats = departures.reduce(
    (sum, departure) => sum + (departure.totalSeats - departure.seatsAvailable),
    0,
  );
  const occupancyRate =
    totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  const totalBookings = await prisma.booking.count({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  const cancelledBookings = await prisma.booking.count({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: "CANCELLED",
    },
  });

  const cancellationRate =
    totalBookings > 0
      ? Math.round((cancelledBookings / totalBookings) * 100)
      : 0;

  const pendingRefunds = await prisma.payment.aggregate({
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
  });

  return {
    totalBookingsThisMonth: thisMonthBookings,
    revenueThisMonth: thisMonthRevenue._sum.amount || 0,
    upcomingTreksNext30Days: upcomingTreks,
    occupancyRate,
    cancellationRate,
    refundPending: pendingRefunds._sum.refundAmount || 0,
  };
}
