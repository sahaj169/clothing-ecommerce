import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const career = await prisma.career.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!career) {
      return new NextResponse("Career not found", { status: 404 });
    }

    return NextResponse.json(career);
  } catch (error) {
    console.error("[CAREER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
