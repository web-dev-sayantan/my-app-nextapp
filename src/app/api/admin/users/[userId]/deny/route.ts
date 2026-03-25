import { NextResponse } from "next/server";
import { logAudit } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { requireApiRole } from "@/lib/apiAuth";

// POST: Toggle deny access (Super Admin only)
export async function POST(
  request: Request,
  props: { params: Promise<{ userId: string }> },
) {
  const params = await props.params;
  const { response, user: adminUser } = await requireApiRole("SUPER_ADMIN");

  if (response || !adminUser) {
    return (
      response ?? NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    );
  }

  try {
    const { deny } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, username: true, isDenied: true, role: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent acting on self
    if (existingUser.id === adminUser.id) {
      return NextResponse.json(
        { error: "Cannot perform this action on yourself" },
        { status: 400 },
      );
    }

    // Prevent denying other Super Admins
    if (
      deny &&
      existingUser.role === "SUPER_ADMIN" &&
      existingUser.id !== adminUser.id
    ) {
      return NextResponse.json(
        { error: "Cannot deny access to another Super Admin" },
        { status: 403 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: { isDenied: Boolean(deny) },
    });

    // Log the action
    await logAudit(
      deny ? "DENY_ACCESS" : "ALLOW_ACCESS",
      "User",
      params.userId,
      adminUser.id,
      { isDenied: { from: existingUser.isDenied, to: Boolean(deny) } },
      { targetUsername: existingUser.username },
    );

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        isDenied: updatedUser.isDenied,
      },
    });
  } catch (error) {
    console.error("Error toggling deny access:", error);
    return NextResponse.json(
      { error: "Failed to toggle deny access" },
      { status: 500 },
    );
  }
}
