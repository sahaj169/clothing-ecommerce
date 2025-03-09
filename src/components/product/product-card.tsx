"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Product, Size } from "@prisma/client";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  // Ensure product.images is an array and has at least one item
  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "/images/placeholder.jpg";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md">
      <div className="aspect-square overflow-hidden bg-gray-50">
        <Link
          href={`/product/${product.id}`}
          className="relative block h-full w-full"
        >
          <div className="h-full w-full">
            <OptimizedImage
              src={imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="transition-transform duration-300 group-hover:scale-105"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              objectFit="cover"
            />
          </div>
          {product.discount && product.discount > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              {product.discount}% OFF
            </span>
          )}
          {product.featured && (
            <span className="absolute right-2 top-2 rounded-full bg-indigo-500 px-2 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
        </Link>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/product/${product.id}`}
          className="text-sm font-medium text-gray-900 hover:text-indigo-600"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-gray-500 capitalize">
          {product.category.toLowerCase().replace("_", " ")}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-900">
              {formatPrice(product.price * (1 - (product.discount || 0) / 100))}
            </p>
            {product.discount && product.discount > 0 && (
              <p className="text-xs text-gray-500 line-through">
                {formatPrice(product.price)}
              </p>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center">
              <span className="text-xs font-medium text-amber-500">
                {product.rating.toFixed(1)}
              </span>
              <span className="ml-1 text-xs text-gray-500">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
