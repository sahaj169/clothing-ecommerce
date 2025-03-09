import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: "Token and email are required" },
        { status: 400 }
      );
    }

    // Find user by email and valid token
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Token is valid" });
  } catch (error) {
    console.error("Verify reset token error:", error);
    return NextResponse.json(
      { error: "Failed to verify reset token" },
      { status: 500 }
    );
  }
}
