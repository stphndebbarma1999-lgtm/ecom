import type { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";

export default function ProductGrid({
  products,
  columns = "default",
}: {
  products: Product[];
  columns?: "default" | "wide";
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
        <p className="text-sm font-medium text-neutral-900">No products found</p>
        <p className="text-sm text-neutral-500">Try adjusting your filters or search.</p>
      </div>
    );
  }

  return (
    <div
      className={
        columns === "wide"
          ? "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
          : "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      }
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
