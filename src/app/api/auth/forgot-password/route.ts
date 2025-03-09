import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db/prisma";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const RESET_TOKEN_EXPIRES_IN = 60 * 60 * 1000; // 1 hour in milliseconds

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success even if user not found for security
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists, you will receive a password reset email",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN);

    // Save reset token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Create reset URL
    const resetUrl = `${
      process.env.NEXTAUTH_URL
    }/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send email
    await resend.emails.send({
      from: "StyleHub <noreply@stylehub.com>",
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>StyleHub Team</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "If an account exists, you will receive a password reset email",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
