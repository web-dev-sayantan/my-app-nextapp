import { NextResponse } from "next/server";
import { checkUserRole } from "@/lib/roleUtils";

export type RequiredRole = "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "USER";

export async function requireApiRole(requiredRole: RequiredRole) {
  const result = await checkUserRole(requiredRole);

  if (!result.authorized || !result.user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 403 }),
    };
  }

  return {
    user: result.user,
    response: null,
  };
}
