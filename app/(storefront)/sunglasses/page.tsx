import type { Metadata } from "next";
import { getDepartmentInfo } from "@/lib/db/categories";
import { getProductsByDepartment } from "@/lib/db/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Sunglasses Online | ${siteConfig.name}`,
  description: "Shop sunglasses for men and women.",
};

export default async function SunglassesPage() {
  const [department, products] = await Promise.all([
    getDepartmentInfo("sunglasses"),
    getProductsByDepartment("sunglasses"),
  ]);

  return (
    <CategoryListing
      title={department.heading}
      description={department.description}
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Sunglasses" }]}
      products={products}
      allDepartmentCategories={department.categories}
      categoryBaseHref="/sunglasses"
    />
  );
}
