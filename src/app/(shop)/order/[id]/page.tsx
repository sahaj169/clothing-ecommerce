import { getServerAuth } from "@/lib/auth/get-server-auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import OrderDetailsClient from "./client";

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { user, isAuthenticated } = await getServerAuth();
  const orderId = params.id;

  // Fetch the order with items and product details
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
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

  // If order doesn't exist, redirect to 404
  if (!order) {
    redirect("/not-found");
  }

  // If user is not authenticated and this is not their order, redirect to login
  if (!isAuthenticated && order.userId !== user?.id) {
    redirect("/login");
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
    subtotal: order.subtotal,
    tax: order.tax,
    shipping: order.shipping,
    discount: order.discount,
    trackingNumber: order.trackingNumber || "",
    estimatedDelivery: order.estimatedDelivery
      ? order.estimatedDelivery.toISOString()
      : null,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || "",
      color: item.color || "",
      image: item.product.images[0] || "",
    })),
    address: order.address
      ? {
          name: order.address.name,
          street: order.address.street,
          city: order.address.city,
          state: order.address.state,
          postalCode: order.address.postalCode,
          country: order.address.country,
          phone: order.address.phone,
        }
      : null,
  };

  return <OrderDetailsClient order={formattedOrder} />;
}
