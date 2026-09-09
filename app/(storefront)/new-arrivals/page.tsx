import type { Metadata } from "next";
import { getNewArrivals } from "@/lib/db/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `New Arrivals | ${siteConfig.name}`,
  description: "Discover the newest additions across men's, women's and beauty collections.",
};

export default async function NewArrivalsPage() {
  const products = await getNewArrivals();

  return (
    <CategoryListing
      title="New Arrivals"
      description="Freshly landed styles across every department."
      breadcrumb={[{ label: "Home", href: "/" }, { label: "New Arrivals" }]}
      products={products}
      categoryBaseHref="/new-arrivals"
    />
  );
}
