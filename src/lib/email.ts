import nodemailer from "nodemailer";
import { Resend } from "resend";

export type SendEmailResult =
  | { success: true; data: unknown; method: "resend" | "smtp" }
  | { success: true; mock: true }
  | { success: false; error: string };

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

// Create nodemailer transporter for SMTP
const createSMTPTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT || "587");
  const isSecure = port === 465; // SSL for port 465, STARTTLS for 587

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: port,
    secure: isSecure, // true for 465 (SSL), false for 587 (STARTTLS)
    requireTLS: !isSecure, // Force TLS for port 587
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
  });

  return transporter;
};

// Create Resend client (optional fallback)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.EMAIL_FROM || "Trail Makers <hello@trailmakers.in>";

/**
 * Send an email using Resend (primary) or SMTP (fallback)
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendEmailResult> {
  // Try Resend first (primary)
  if (resend) {
    try {
      const data = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      });

      console.log("Email sent via Resend:", data);
      return { success: true, data, method: "resend" };
    } catch (error) {
      console.error("Resend send error:", error);
      // Fall through to SMTP
    }
  }

  // Try SMTP as fallback
  if (process.env.SMTP_HOST && process.env.SMTP_PASS) {
    try {
      const transporter = createSMTPTransporter();

      const info = await transporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      });

      console.log("Email sent via SMTP:", info.messageId);
      return { success: true, data: info, method: "smtp" };
    } catch (error) {
      console.error("SMTP send error:", getErrorMessage(error));
    }
  }

  // Mock mode for development
  console.log("Email (mock):", { to, subject, html });
  return { success: true, mock: true };
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({
  to,
  resetToken,
  userName,
}: {
  to: string;
  resetToken: string;
  userName: string;
}) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: 'Poppins', Arial, sans-serif; background-color: #000; color: #fff; padding: 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111; border-radius: 12px; padding: 40px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #fff; margin: 0;">Trail Makers</h1>
    </div>
    
    <h2 style="color: #fff;">Hello ${userName || "there"},</h2>
    
    <p style="color: #aaa; line-height: 1.6;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="display: inline-block; background-color: #3b82f6; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Reset Password
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      This link will expire in 1 hour.<br>
      If you didn't request a password reset, please ignore this email.
    </p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; text-align: center;">
      <p style="color: #666; font-size: 12px; margin: 0;">
        Trail Makers - Adventure Awaits<br>
        www.trailmakers.in
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: "Reset Your Trail Makers Password",
    html,
  });
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail({
  to,
  userName,
  bookingDetails,
}: {
  to: string;
  userName: string;
  bookingDetails: {
    trekName: string;
    startDate: string;
    endDate: string;
    numberOfPeople: number;
    totalAmount: number;
    bookingId: string;
  };
}) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
</head>
<body style="font-family: 'Poppins', Arial, sans-serif; background-color: #000; color: #fff; padding: 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111; border-radius: 12px; padding: 40px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #fff; margin: 0;">Trail Makers</h1>
    </div>
    
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; background-color: #22c55e; color: #fff; padding: 10px 20px; border-radius: 50px; font-weight: 600;">
        ✓ Booking Confirmed
      </div>
    </div>
    
    <h2 style="color: #fff;">Hello ${userName || "there"},</h2>
    
    <p style="color: #aaa; line-height: 1.6;">
      Thank you for booking with Trail Makers! Your adventure is confirmed.
    </p>
    
    <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #fff; margin-top: 0;">Booking Details</h3>
      
      <div style="margin: 15px 0;">
        <span style="color: #666;">Trek:</span>
        <span style="color: #fff; margin-left: 10px;">${bookingDetails.trekName}</span>
      </div>
      
      <div style="margin: 15px 0;">
        <span style="color: #666;">Dates:</span>
        <span style="color: #fff; margin-left: 10px;">${bookingDetails.startDate} - ${bookingDetails.endDate}</span>
      </div>
      
      <div style="margin: 15px 0;">
        <span style="color: #666;">Travelers:</span>
        <span style="color: #fff; margin-left: 10px;">${bookingDetails.numberOfPeople} person(s)</span>
      </div>
      
      <div style="margin: 15px 0;">
        <span style="color: #666;">Total Amount:</span>
        <span style="color: #22c55e; margin-left: 10px; font-weight: 600;">₹${(bookingDetails.totalAmount / 100).toLocaleString("en-IN")}</span>
      </div>
      
      <div style="margin: 15px 0;">
        <span style="color: #666;">Booking ID:</span>
        <span style="color: #fff; margin-left: 10px; font-family: monospace;">${bookingDetails.bookingId}</span>
      </div>
    </div>
    
    <p style="color: #aaa; line-height: 1.6;">
      We're excited to have you join us! If you have any questions about your trek, feel free to reach out.
    </p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; text-align: center;">
      <p style="color: #666; font-size: 12px; margin: 0;">
        Trail Makers - Adventure Awaits<br>
        www.trailmakers.in
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: `Booking Confirmed: ${bookingDetails.trekName}`,
    html,
  });
}
