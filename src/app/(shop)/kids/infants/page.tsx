import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ProductGrid } from "@/components/product/product-grid";
import { Gender } from "@prisma/client";

export const metadata: Metadata = {
  title: "Infants' Clothing | StyleHub",
  description:
    "Explore our collection of infants' clothing, from onesies to adorable outfits.",
};

export default async function KidsInfantsPage() {
  const products = await prisma.product.findMany({
    where: {
      gender: Gender.KIDS,
      inStock: true,
      // Additional filter can be added here when we have a specific category for infants
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
            Infants' Clothing
          </h1>
          <p className="mt-4 max-w-xl text-center text-gray-500">
            Discover our collection of comfortable and adorable clothing for
            your little ones.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
