import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  Size,
  Color,
} from "@prisma/client";
import { generateOrderNumber } from "@/lib/utils";

// Create a new order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, addressId, paymentMethod, total, subtotal, tax, shipping } =
      body;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify all products exist
    const productIds = items.map(
      (item: { productId: string }) => item.productId
    );
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 404 }
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber: `ORD-${Date.now()}`,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: paymentMethod as PaymentMethod,
        total,
        subtotal,
        tax,
        shipping,
        addressId,
        items: {
          create: items.map(
            (item: {
              productId: string;
              quantity: number;
              size: string;
              color?: string;
              price?: number;
            }) => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size as Size,
              color: (item.color || "BLACK") as Color,
              price: item.price || 0,
            })
          ),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user's orders
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: {
        user: {
          email: session.user.email,
        },
        ...(status && { status: status as OrderStatus }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
