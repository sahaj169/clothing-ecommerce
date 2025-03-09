import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { OrderStatus } from "@prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orderId = params.id;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Find the order and check if it belongs to the user
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    if (order.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the order can be cancelled
    if (order.status === OrderStatus.DELIVERED) {
      return new NextResponse("Cannot cancel a delivered order", {
        status: 400,
      });
    }

    if (order.status === OrderStatus.CANCELLED) {
      return new NextResponse("Order is already cancelled", { status: 400 });
    }

    // Cancel the order
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    return NextResponse.json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("[ORDER_CANCEL_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
