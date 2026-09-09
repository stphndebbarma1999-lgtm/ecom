import type { Metadata } from "next";
import { getDepartmentInfo } from "@/lib/db/categories";
import { getProductsByDepartment } from "@/lib/db/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Beauty Products Online | ${siteConfig.name}`,
  description: "Shop skincare, makeup, haircare, fragrance and Korean beauty essentials.",
};

export default async function BeautyPage() {
  const [department, products] = await Promise.all([
    getDepartmentInfo("beauty"),
    getProductsByDepartment("beauty"),
  ]);

  return (
    <CategoryListing
      title={department.heading}
      description={department.description}
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Beauty" }]}
      products={products}
      allDepartmentCategories={department.categories}
      categoryBaseHref="/beauty"
    />
  );
}
