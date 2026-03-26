import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminDashboardOverview } from "@/lib/services/adminDashboardService";
import AdminDashboardClient from "./dashboard-client";
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  if (
    session.user.role !== "SUPER_ADMIN" &&
    session.user.role !== "ADMIN" &&
    session.user.role !== "MODERATOR"
  ) {
    redirect("/access-denied");
  }

  const initialStats = await getAdminDashboardOverview();

  return (
    <AdminDashboardClient
      initialRole={session.user.role}
      initialStats={initialStats}
    />
  );
}
