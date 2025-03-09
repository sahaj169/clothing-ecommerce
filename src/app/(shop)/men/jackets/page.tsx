import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ProductGrid } from "@/components/product/product-grid";
import { Gender, Category } from "@prisma/client";

export const metadata: Metadata = {
  title: "Men's Jackets | StyleHub",
  description:
    "Explore our collection of men's jackets, from casual to winter wear.",
};

export default async function MenJacketsPage() {
  const products = await prisma.product.findMany({
    where: {
      gender: Gender.MEN,
      category: Category.JACKET,
      inStock: true,
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
            Men's Jackets
          </h1>
          <p className="mt-4 max-w-xl text-center text-gray-500">
            Discover our collection of stylish jackets, from lightweight to
            winter styles.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
