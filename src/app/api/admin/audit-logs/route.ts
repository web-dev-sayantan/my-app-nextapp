import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

function parseJsonField(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

// GET audit logs (admin & moderator)
export async function GET(request: Request) {
  const { response } = await requireApiRole("MODERATOR");

  if (response) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const entityType = searchParams.get("entityType");
    const userId = searchParams.get("userId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const page = parseInt(searchParams.get("page") || "1");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Prisma.AuditLogWhereInput = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (userId) where.userId = userId;

    if (startDate || endDate) {
      const createdAt: Prisma.DateTimeFilter<"AuditLog"> = {};
      if (startDate) createdAt.gte = new Date(startDate);
      if (endDate) createdAt.lte = new Date(endDate);
      where.createdAt = createdAt;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Parse JSON fields
    const parsedLogs = logs.map((log) => ({
      ...log,
      changes: parseJsonField(log.changes),
      metadata: parseJsonField(log.metadata),
    }));

    return NextResponse.json({
      success: true,
      logs: parsedLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 },
    );
  }
}
