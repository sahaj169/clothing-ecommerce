import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const addressId = params.id;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if address belongs to user
    const addressBelongsToUser = user.addresses.some(
      (address) => address.id === addressId
    );

    if (!addressBelongsToUser) {
      return new NextResponse("Address not found", { status: 404 });
    }

    // Unset any existing default address
    await prisma.address.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    // Set the new default address
    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        isDefault: true,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("[ADDRESS_DEFAULT_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
