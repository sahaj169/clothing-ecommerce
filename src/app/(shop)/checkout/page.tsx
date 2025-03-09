import { getServerAuth } from "@/lib/auth/get-server-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import CheckoutClient from "./client";

export default async function CheckoutPage() {
  const { user, isAuthenticated } = await getServerAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    redirect("/login?redirect=/checkout");
  }

  // Fetch user addresses
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

  // Format addresses for the client component
  const formattedAddresses = addresses.map((address) => ({
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

  return (
    <CheckoutClient
      addresses={formattedAddresses}
      isAuthenticated={isAuthenticated}
    />
  );
}
