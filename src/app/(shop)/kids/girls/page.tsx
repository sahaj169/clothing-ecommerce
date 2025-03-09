import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ProductGrid } from "@/components/product/product-grid";
import { Gender } from "@prisma/client";

export const metadata: Metadata = {
  title: "Girls' Clothing | StyleHub",
  description:
    "Explore our collection of girls' clothing, from casual wear to special occasions.",
};

export default async function KidsGirlsPage() {
  const products = await prisma.product.findMany({
    where: {
      gender: Gender.KIDS,
      inStock: true,
      // Additional filter can be added here when we have a specific category for girls
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Girls' Clothing
          </h1>
          <p className="mt-4 max-w-xl text-center text-gray-500">
            Discover our collection of comfortable and stylish clothing for
            girls of all ages.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
