import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginClient from "./login-client";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;
  const nextPath = params.next ?? null;

  if (session?.user) {
    if (nextPath) {
      redirect(nextPath);
    }

    if (
      session.user.role === "ADMIN" ||
      session.user.role === "SUPER_ADMIN" ||
      session.user.role === "MODERATOR"
    ) {
      redirect("/admin");
    }

    redirect("/dashboard");
  }

  return <LoginClient nextPath={nextPath} />;
}
