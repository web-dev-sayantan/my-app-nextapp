export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiRole } from "@/lib/apiAuth";

export async function GET(req: Request) {
  try {
    const { response } = await requireApiRole("MODERATOR");
    if (response) {
      return response;
    }

    const recent = await prisma.failedLoginAttempt.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ success: true, attempts: recent });
  } catch (error) {
    console.error("Failed to fetch login attempts", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
