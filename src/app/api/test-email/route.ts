import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getErrorMessage } from "@/lib/email";

/**
 * Test endpoint to verify email sending
 * GET /api/test-email?to=your@email.com
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get("to");

  if (!to) {
    return NextResponse.json(
      { error: 'Please provide a "to" query parameter' },
      { status: 400 },
    );
  }

  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      {
        success: false,
        error: "RESEND_API_KEY is not configured in environment variables",
        envCheck: {
          hasResendKey: false,
          hasEmailFrom: !!process.env.EMAIL_FROM,
        },
      },
      { status: 500 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.EMAIL_FROM || "Trail Makers <onboarding@resend.dev>";

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: to,
      subject: "Test Email from Trail Makers",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 12px; padding: 30px; }
            h1 { color: #3b82f6; }
            .success { color: #22c55e; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Test Email Successful!</h1>
            <p>This is a test email from <strong>Trail Makers</strong>.</p>
            <p class="success">Email sent via Resend API ✓</p>
            <p>If you received this email, your email configuration is working correctly.</p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      data,
      method: "resend",
      envCheck: {
        hasResendKey: true,
        hasEmailFrom: !!process.env.EMAIL_FROM,
      },
    });
  } catch (error) {
    console.error("=== Email sending failed ===");
    console.error("Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
        envCheck: {
          hasResendKey: !!process.env.RESEND_API_KEY,
          hasEmailFrom: !!process.env.EMAIL_FROM,
        },
      },
      { status: 500 },
    );
  }
}
