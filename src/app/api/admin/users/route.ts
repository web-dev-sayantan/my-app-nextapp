import { NextResponse } from "next/server";
import { logAudit } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { requireApiRole } from "@/lib/apiAuth";
import type { Prisma, UserRole } from "@prisma/client";

const validUserRoles: UserRole[] = [
  "ADMIN",
  "MODERATOR",
  "USER",
  "SUPER_ADMIN",
  "TREK_LEADER",
];

function parseUserRole(role: unknown): UserRole | null {
  if (typeof role !== "string") {
    return null;
  }

  return validUserRoles.includes(role as UserRole) ? (role as UserRole) : null;
}

// GET all users
export async function GET(request: Request) {
  const { response } = await requireApiRole("ADMIN");

  if (response) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const requestedRole = searchParams.get("role");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const page = parseInt(searchParams.get("page") || "1");

    const where: Prisma.UserWhereInput = {};
    if (requestedRole) {
      const role = parseUserRole(requestedRole);

      if (!role) {
        return NextResponse.json(
          { error: "Invalid role filter" },
          { status: 400 },
        );
      }

      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

// CREATE a new user (admin only)
export async function POST(request: Request) {
  const { response, user: adminUser } = await requireApiRole("ADMIN");

  if (response) {
    return response;
  }

  try {
    const {
      email,
      username,
      password,
      firstName,
      lastName,
      role: rawRole,
    } = await request.json();

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username, and password are required" },
        { status: 400 },
      );
    }

    const role = rawRole ? parseUserRole(rawRole) : "USER";
    if (!role) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 400 },
      );
    }

    // Hash password (in production, use bcrypt)
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    await logAudit("USER_CREATED", "USER", newUser.id, adminUser.id, {
      email,
      username,
      role,
    });

    return NextResponse.json(
      {
        success: true,
        user: newUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
