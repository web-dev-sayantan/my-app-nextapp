import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { UserRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminClient, { type AdminUserRecord } from "./admin-client";

export const dynamic = "force-dynamic";

async function getAdminUsers(): Promise<AdminUserRecord[]> {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      isLocked: true,
      isDenied: true,
      accountLockedUntil: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/access-denied");
  }

  const users = await getAdminUsers();

  return (
    <AdminClient
      initialUsers={users}
      currentUserId={session.user.id}
      currentUserRole={session.user.role as UserRole}
    />
  );
}
