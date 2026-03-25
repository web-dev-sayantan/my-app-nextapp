import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getErrorMessage, sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { authRatelimit } from "@/lib/ratelimit";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/reset-password
 * Request a password reset - sends email with reset link
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "anonymous";
    const { success } = await authRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      });

      const result = await sendPasswordResetEmail({
        to: user.email,
        resetToken,
        userName: user.firstName || user.username || "User",
      });

      if (!result.success) {
        console.error("Failed to send password reset email:", result.error);
      } else {
        console.log(
          "Password reset email sent successfully via:",
          "method" in result ? result.method : "mock",
        );
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link shortly.",
    });
  } catch (error) {
    console.error("Password reset request error:", getErrorMessage(error));
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/auth/reset-password
 * Reset password using token
 */
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "anonymous";
    const { success } = await authRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Token and new password are required" },
        { status: 400 },
      );
    }

    // Fix #9 - stronger password policy
    if (newPassword.length < 12) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 12 characters" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Password reset error:", getErrorMessage(error));
    return NextResponse.json(
      { success: false, error: "Failed to reset password" },
      { status: 500 },
    );
  }
}
