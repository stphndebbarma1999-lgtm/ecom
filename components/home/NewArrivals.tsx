import { getNewArrivals } from "@/lib/db/products";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/product/ProductCard";

export default async function NewArrivals() {
  const products = await getNewArrivals(12);

  return (
    <section className="border-b border-neutral-100 py-10 lg:py-14">
      <div className="container-nova">
        <SectionHeader title="New Arrivals" viewAllHref="/new-arrivals" />
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
