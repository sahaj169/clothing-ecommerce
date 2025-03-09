import { getServerAuth } from "@/lib/auth/get-server-auth";
import { prisma } from "@/lib/db/prisma";
import CheckoutSuccessClient from "./client";

interface CheckoutSuccessPageProps {
  searchParams: {
    orderId?: string;
  };
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { user, isAuthenticated } = await getServerAuth();
  const orderId = searchParams.orderId;

  if (!orderId) {
    return (
      <CheckoutSuccessClient
        order={null}
        error="No order ID found. Please check your order history."
      />
    );
  }

  // Only fetch order if user is authenticated
  if (!isAuthenticated || !user?.email) {
    return (
      <CheckoutSuccessClient
        order={null}
        error="You must be logged in to view order details."
      />
    );
  }

  try {
    // Fetch the order with items and address
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        user: {
          email: user.email,
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

    if (!order) {
      return (
        <CheckoutSuccessClient
          order={null}
          error="Order not found. Please check your order history."
        />
      );
    }

    // Format the order data for the client component
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "",
        image: item.product.images[0] || "",
      })),
      address: {
        name: order.address.name,
        street: order.address.street,
        city: order.address.city,
        state: order.address.state,
        postalCode: order.address.postalCode,
        country: order.address.country,
        phone: order.address.phone,
      },
    };

    return <CheckoutSuccessClient order={formattedOrder} />;
  } catch (error) {
    console.error("Error fetching order:", error);
    return (
      <CheckoutSuccessClient
        order={null}
        error="Failed to fetch order details. Please try again later."
      />
    );
  }
}
