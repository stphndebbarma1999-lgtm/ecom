import type { Metadata } from "next";
import { getDepartmentInfo } from "@/lib/db/categories";
import { getProductsByDepartment } from "@/lib/db/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Watches Online | ${siteConfig.name}`,
  description: "Shop analog, sports and smart watches.",
};

export default async function WatchesPage() {
  const [department, products] = await Promise.all([
    getDepartmentInfo("watches"),
    getProductsByDepartment("watches"),
  ]);

  return (
    <CategoryListing
      title={department.heading}
      description={department.description}
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Watches" }]}
      products={products}
      allDepartmentCategories={department.categories}
      categoryBaseHref="/watches"
    />
  );
}
