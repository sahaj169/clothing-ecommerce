"use client";

import { Product } from "@prisma/client";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  title?: string;
  priorityImages?: boolean;
}

export function ProductGrid({
  products = [],
  title,
  priorityImages = false,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">
              No products found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters or check back later for new arrivals.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {title && (
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
        )}

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={priorityImages && index < 4} // Only prioritize the first 4 images
            />
          ))}
        </div>
      </div>
    </div>
  );
}
