import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ProductGrid } from "@/components/product/product-grid";
import { Gender } from "@prisma/client";

export const metadata: Metadata = {
  title: "Women's Collection | StyleHub",
  description:
    "Explore our women's collection featuring the latest trends in fashion.",
};

export default async function WomenPage() {
  const products = await prisma.product.findMany({
    where: {
      gender: Gender.WOMEN,
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
            Women's Collection
          </h1>
          <p className="mt-4 max-w-xl text-center text-gray-500">
            Discover our latest women's fashion collection, featuring everything
            from casual wear to formal attire.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
