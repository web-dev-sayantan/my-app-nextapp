import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./profile-client";

export const dynamic = "force-dynamic";

async function getProfileData(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      address: true,
      city: true,
      state: true,
      pincode: true,
    },
  });

  if (!user) {
    return null;
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      departureId: true,
      numberOfPeople: true,
      totalAmount: true,
      status: true,
      contactName: true,
      contactPhone: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return { user, bookings };
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const data = await getProfileData(session.user.email);

  if (!data) {
    redirect("/login");
  }

  return (
    <ProfileClient initialProfile={data.user} initialBookings={data.bookings} />
  );
}
