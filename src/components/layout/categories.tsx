"use client";

import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

const categories = [
  {
    name: "Men",
    href: "/men",
    imageSrc:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVuJTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    description: "Shop the latest trends in men's fashion.",
  },
  {
    name: "Women",
    href: "/women",
    imageSrc:
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29tZW4lMjBmYXNoaW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    description: "Discover stylish clothing for every occasion.",
  },
  {
    name: "Kids",
    href: "/kids",
    imageSrc:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2lkcyUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    description: "Cute and comfortable clothes for your little ones.",
  },
];

export function Categories() {
  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {categories.map((category) => (
              <div key={category.name} className="group relative">
                <Link href={category.href} className="block">
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                    <PlaceholderImage
                      src={category.imageSrc}
                      alt={category.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-base text-gray-500">
                    {category.description}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
