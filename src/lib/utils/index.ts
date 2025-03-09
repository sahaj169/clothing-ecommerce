import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "@/lib/db/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function generateRandomId() {
  return Math.random().toString(36).substring(2, 15);
}

export function getImageUrl(path: string) {
  return path.startsWith("http") ? path : `/images/${path}`;
}

export async function getProducts(filter?: "new" | "sale") {
  return await prisma.product.findMany({
    where: {
      ...(filter === "new" && {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      ...(filter === "sale" && { discount: { not: null } }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
