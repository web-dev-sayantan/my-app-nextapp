import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { requireApiRole } from "@/lib/apiAuth";
import { logAudit } from "@/lib/roleUtils";

export async function POST(
  req: Request,
  props: { params: Promise<{ userId: string }> },
) {
  const params = await props.params;
  try {
    const { response, user: adminUser } = await requireApiRole("ADMIN");
    if (response || !adminUser) {
      return (
        response ?? NextResponse.json({ error: "Forbidden" }, { status: 403 })
      );
    }

    if (adminUser.id === params.userId) {
      return NextResponse.json(
        { error: "Cannot perform this action on yourself" },
        { status: 400 },
      );
    }

    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tempPassword =
      "TempPass#" + Math.floor(Math.random() * 90000 + 10000).toString();
    const hashed = await bcrypt.hash(tempPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed, passwordChangedAt: new Date() },
    });

    // Note: For security we do not return the temporary password in production. Here we return it for admin use.
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail =
      process.env.EMAIL_FROM || "Trail Makers <onboarding@resend.dev>";

    await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: "Your Trail Makers Password Has Been Reset",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 12px; padding: 30px; }
            h1 { color: #3b82f6; }
            .password-box { background: #3a3a3a; padding: 15px; border-radius: 8px; font-size: 20px; font-weight: bold; letter-spacing: 2px; margin: 20px 0; }
            .warning { color: #f59e0b; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔐 Password Reset</h1>
            <p>Your Trail Makers account password has been reset by an administrator.</p>
            <p>Your temporary password is:</p>
            <div class="password-box">${tempPassword}</div>
            <p class="warning">⚠️ Please log in and change your password immediately.</p>
          </div>
        </body>
        </html>
      `,
    });

    await logAudit(
      "PASSWORD_RESET",
      "USER",
      userId,
      adminUser.id,
      {},
      { email: user.email },
    );

    return NextResponse.json({
      success: true,
      message:
        "Password reset. User has been emailed their temporary password.",
    });
  } catch (error) {
    console.error("Failed to reset password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 },
    );
  }
}
