import { NextResponse } from "next/server";
import { unlockUserAccount } from "@/lib/roleUtils";
import { requireApiRole } from "@/lib/apiAuth";

// UNLOCK a locked user account (admin only)
export async function POST(
  request: Request,
  props: { params: Promise<{ userId: string }> },
) {
  const params = await props.params;
  const { response, user: adminUser } = await requireApiRole("ADMIN");

  if (response || !adminUser) {
    return (
      response ?? NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    );
  }

  try {
    const result = await unlockUserAccount(params.userId, adminUser.id);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "User account unlocked",
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to unlock account" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error unlocking account:", error);
    return NextResponse.json(
      { error: "Failed to unlock account" },
      { status: 500 },
    );
  }
}
