import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ProductGrid } from "@/components/product/product-grid";
import { Gender, Category } from "@prisma/client";

export const metadata: Metadata = {
  title: "Men's Formal Wear | StyleHub",
  description:
    "Explore our collection of men's formal wear, from suits to dress shirts.",
};

export default async function MenFormalPage() {
  const products = await prisma.product.findMany({
    where: {
      gender: Gender.MEN,
      category: Category.FORMAL,
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
            Men's Formal Wear
          </h1>
          <p className="mt-4 max-w-xl text-center text-gray-500">
            Discover our collection of sophisticated formal wear for every
            occasion.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
