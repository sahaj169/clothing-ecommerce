import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { JobStatus } from "@prisma/client";

export async function GET() {
  try {
    const careers = await prisma.career.findMany({
      where: {
        status: JobStatus.OPEN,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(careers);
  } catch (error) {
    console.error("[CAREERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 