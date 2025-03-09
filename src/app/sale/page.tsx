import { Metadata } from "next";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { Suspense } from "react";
import ProductGridServer from "@/components/product/product-grid-server";
import { getProducts } from "@/lib/utils/index";

export const metadata: Metadata = {
  title: "Sale | Store",
  description: "Check out our products on sale.",
};

export default async function SalePage() {
  const products = await getProducts("sale");
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="border-b border-gray-200 pb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Sale
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Don't miss out on these amazing deals. Limited time offers on
            selected items.
          </p>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGridServer products={products} />
        </Suspense>
      </div>
    </div>
  );
}
