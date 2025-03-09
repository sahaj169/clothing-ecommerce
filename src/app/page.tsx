import { Hero } from "@/components/layout/hero";
import { Categories } from "@/components/layout/categories";
import { FeaturedProducts } from "@/components/layout/featured-products";
import { prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "StyleHub - Fashion for Everyone",
  description:
    "Your one-stop destination for trendy fashion across all ages and styles.",
};

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: {
      featured: true,
    },
    take: 8,
  });

  return (
    <div>
      <Hero />
      <Categories />
      <FeaturedProducts products={featuredProducts} />
    </div>
  );
}
