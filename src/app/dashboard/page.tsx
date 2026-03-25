import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

async function getDashboardBookings(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return [];
  }

  return prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      departure: {
        include: {
          trek: {
            select: {
              name: true,
              state: true,
            },
          },
        },
      },
      payment: {
        select: {
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const bookings = await getDashboardBookings(session.user.email);

  return (
    <DashboardClient
      user={{
        email: session.user.email,
        username: session.user.username,
      }}
      bookings={bookings}
    />
  );
}
