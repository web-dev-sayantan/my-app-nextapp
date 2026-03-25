import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";
import type { UserRole } from "@prisma/client";

type AuthorizedUser = {
  id: string;
  role: UserRole;
  isActive: boolean;
  isLocked: boolean;
  isDenied: boolean;
};

const roleHierarchy: Record<UserRole, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  MODERATOR: 3,
  TREK_LEADER: 2,
  USER: 1,
};

// Check if user has required role
export async function checkUserRole(
  requiredRole: "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "USER",
) {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session?.user?.email) {
    return { authorized: false, user: null };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      role: true,
      isActive: true,
      isLocked: true,
      isDenied: true,
    },
  });

  if (!user || !user.isActive || user.isLocked || user.isDenied) {
    return { authorized: false, user };
  }

  const userRoleLevel = roleHierarchy[user.role];
  const authorizedRoleLevel = roleHierarchy[requiredRole];
  const authorized = userRoleLevel >= authorizedRoleLevel;

  return { authorized, user: user as AuthorizedUser };
}

// Log an audit event
export async function logAudit(
  action: string,
  entityType: string,
  entityId: string,
  userId?: string | null,
  changes?: Record<string, unknown>,
  metadata?: Record<string, unknown>,
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId: userId || null,
        changes: changes ? JSON.stringify(changes) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        description: `${action} on ${entityType} ${entityId}`,
      },
    });
  } catch (error) {
    console.error("Failed to log audit:", error);
  }
}

// Track failed login attempt
export async function trackFailedLogin(
  email: string,
  ipAddress?: string,
  userAgent?: string,
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (user) {
      await prisma.failedLoginAttempt.create({
        data: {
          userId: user.id,
          email,
          ipAddress,
          userAgent,
        },
      });

      // Check if we should lock the account (more than 5 failed attempts in 1 hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentFailures = await prisma.failedLoginAttempt.count({
        where: {
          userId: user.id,
          createdAt: { gte: oneHourAgo },
        },
      });

      if (recentFailures >= 5) {
        const lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isLocked: true,
            accountLockedUntil: lockUntil,
          },
        });

        await logAudit(
          "ACCOUNT_LOCKED",
          "USER",
          user.id,
          null,
          { reason: "Too many failed login attempts" },
          { ipAddress, userAgent },
        );
      }
    }
  } catch (error) {
    console.error("Failed to track login attempt:", error);
  }
}

// Unlock user account (for admin)
export async function unlockUserAccount(userId: string, adminId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isLocked: false,
        accountLockedUntil: null,
      },
    });

    await logAudit("ACCOUNT_UNLOCKED", "USER", userId, adminId, {
      unlockedBy: adminId,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to unlock account:", error);
    return { success: false, error: (error as Error).message };
  }
}
