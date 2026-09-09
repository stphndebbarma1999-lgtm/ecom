"use client";

import { useRecentlyViewed } from "@/lib/useRecentlyViewed";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/product/ProductCard";

export default function RecentlyViewedSection({ excludeId }: { excludeId: string }) {
  const items = useRecentlyViewed(excludeId);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-neutral-100 py-10">
      <SectionHeader title="Recently Viewed" />
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
