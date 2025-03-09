import { getServerAuth } from "@/lib/auth/get-server-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import AccountPageClient, { Order } from "./client";

export default async function AccountPage() {
  const { user, isAuthenticated } = await getServerAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    redirect("/login");
  }

  // Fetch orders
  const orders = await prisma.order.findMany({
    where: {
      user: {
        email: user.email || "",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  // Fetch addresses
  const addresses = await prisma.address.findMany({
    where: {
      user: {
        email: user.email || "",
      },
    },
    orderBy: {
      isDefault: "desc",
    },
  });

  // Transform data to match client-side expectations
  const formattedOrders = orders.map((order: any) => {
    // Type assertion for order items
    const orderItems = "items" in order ? order.items : [];

    return {
      id: order.id,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      total: order.total,
      items: orderItems.map((item: any) => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "",
        image: item.product.images[0] || "",
      })),
    };
  });

  const formattedAddresses = addresses.map((address: any) => ({
    id: address.id,
    name: address.name,
    street: address.street,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone,
    isDefault: address.isDefault,
  }));

  // Pass the pre-fetched data to the client component
  return (
    <AccountPageClient
      initialOrders={formattedOrders}
      initialAddresses={formattedAddresses}
    />
  );
}
