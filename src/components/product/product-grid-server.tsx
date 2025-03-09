import { ProductCard } from "@/components/product/product-card";
import { Product } from "@prisma/client";

interface ProductGridServerProps {
  products: Product[];
}

export default function ProductGridServer({
  products,
}: ProductGridServerProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
