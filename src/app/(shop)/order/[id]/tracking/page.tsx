import { getServerAuth } from "@/lib/auth/get-server-auth";
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import OrderTrackingClient from "./client";

interface OrderTrackingPageProps {
  params: {
    id: string;
  };
}

export default async function OrderTrackingPage({
  params,
}: OrderTrackingPageProps) {
  const { user, isAuthenticated } = await getServerAuth();
  const orderId = params.id;

  // If user is authenticated, try to fetch the order
  let order = null;

  if (isAuthenticated && user?.email) {
    // Fetch the order with items and product details
    const orderData = await prisma.order.findFirst({
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
      },
    });

    if (orderData) {
      // Format the order data for the client component
      order = {
        id: orderData.id,
        orderNumber: orderData.orderNumber,
        createdAt: orderData.createdAt.toISOString(),
        status: orderData.status,
        trackingNumber: orderData.trackingNumber || undefined,
        estimatedDelivery: orderData.estimatedDelivery
          ? orderData.estimatedDelivery.toISOString()
          : undefined,
        total: orderData.total,
        items: orderData.items.map((item) => ({
          id: item.id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || "",
          image: item.product.images[0] || "",
        })),
      };
    }
  }

  // Pass the data to the client component
  return (
    <OrderTrackingClient
      order={order || undefined}
      orderId={orderId}
      isAuthenticated={isAuthenticated}
      userEmail={user?.email}
    />
  );
}
