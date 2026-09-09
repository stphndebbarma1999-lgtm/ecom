import type { Metadata } from "next";
import { getBestSellers } from "@/lib/db/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Best Sellers | ${siteConfig.name}`,
  description: "Shop our most-loved, top-rated products across every department.",
};

export default async function BestSellersPage() {
  const products = await getBestSellers();

  return (
    <CategoryListing
      title="Best Sellers"
      description="Customer favorites, loved again and again."
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Best Sellers" }]}
      products={products}
      categoryBaseHref="/best-sellers"
    />
  );
}
