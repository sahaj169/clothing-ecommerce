import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import { Color, Size } from "@prisma/client";

// Get cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Find user's cart
    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // If cart doesn't exist, create one
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    // Format cart items for the client
    const formattedItems = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images[0],
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { productId, quantity, size, color } = (await req.json()) as {
      productId: string;
      quantity: number;
      size: Size;
      color?: Color;
    };

    const cart = await prisma.cart.findFirst({
      where: {
        user: {
          email: session.user.email,
        },
      },
    });

    if (!cart) {
      return new Response("Cart not found", { status: 404 });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        size,
        color: color || Color.BLACK,
      },
    });

    return Response.json(cartItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Update cart item
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { id, quantity } = body;

    if (!id || !quantity) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    // Check if item belongs to user's cart
    const cartItem = cart.items.find((item) => item.id === id);

    if (!cartItem) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Update item quantity
    const updatedItem = await prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
    });

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Remove item from cart
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing item ID" }, { status: 400 });
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    // Check if item belongs to user's cart
    const cartItem = cart.items.find((item) => item.id === id);

    if (!cartItem) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Delete item
    await prisma.cartItem.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
