import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        isDefault: "desc",
      },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("[ADDRESSES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, street, city, state, postalCode, country, phone, isDefault } =
      body;

    if (
      !name ||
      !street ||
      !city ||
      !state ||
      !postalCode ||
      !country ||
      !phone
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // If this is the default address, unset any existing default
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Check if this is the first address, make it default
    const addressCount = await prisma.address.count({
      where: {
        userId: user.id,
      },
    });

    const address = await prisma.address.create({
      data: {
        name,
        street,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault: isDefault || addressCount === 0, // First address is default
        userId: user.id,
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("[ADDRESSES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
