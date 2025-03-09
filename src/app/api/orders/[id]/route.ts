import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        user: {
          email: session.user.email,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
        address: true,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Transform the order data to match the expected format
    const transformedOrder = {
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.product.images[0],
      })),
      address: order.address,
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error("[ORDER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
