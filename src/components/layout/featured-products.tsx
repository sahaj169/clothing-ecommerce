"use client";

import { Product } from "@prisma/client";
import { ProductGrid } from "@/components/product/product-grid";
import { useEffect } from "react";
import { preloadFeaturedProductImages } from "@/lib/preload-images";
import { getOptimizedImageUrl } from "@/lib/utils";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Preload featured product images
  useEffect(() => {
    if (products.length > 0) {
      // Get the first image from each product and optimize it
      const imagesToPreload = products
        .filter(
          (product) =>
            Array.isArray(product.images) && product.images.length > 0
        )
        .map((product) => getOptimizedImageUrl(product.images[0], 500, 80));

      // Preload the images
      preloadFeaturedProductImages(imagesToPreload);
    }
  }, [products]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Products
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Discover our handpicked selection of the season's most stylish
            pieces.
          </p>

          <ProductGrid products={products} priorityImages={true} />
        </div>
      </div>
    </div>
  );
}
