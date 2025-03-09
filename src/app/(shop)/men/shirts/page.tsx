import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ProductGrid } from "@/components/product/product-grid";
import { Gender, Category } from "@prisma/client";

export const metadata: Metadata = {
  title: "Men's Shirts | StyleHub",
  description:
    "Explore our collection of men's shirts, from casual to formal wear.",
};

export default async function MenShirtsPage() {
  const products = await prisma.product.findMany({
    where: {
      gender: Gender.MEN,
      category: Category.SHIRT,
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
            Men's Shirts
          </h1>
          <p className="mt-4 max-w-xl text-center text-gray-500">
            Find your perfect shirt, from casual button-downs to formal dress
            shirts.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
