import { getBestSellers } from "@/lib/db/products";
import SectionHeader from "@/components/ui/SectionHeader";
import BestSellerCard from "@/components/product/BestSellerCard";

export default async function BestSellers() {
  const products = await getBestSellers(6);

  return (
    <section className="border-b border-neutral-100 py-10 lg:py-14">
      <div className="container-nova">
        <SectionHeader title="Best Sellers" viewAllHref="/best-sellers" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <BestSellerCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
