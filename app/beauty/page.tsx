import type { Metadata } from "next";
import { getDepartment } from "@/data/categories";
import { getProductsByDepartment } from "@/data/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const metadata: Metadata = {
  title: `Beauty Products Online | ${siteConfig.name}`,
  description: "Shop skincare, makeup, haircare, fragrance and Korean beauty essentials.",
};

export default function BeautyPage() {
  const department = getDepartment("beauty")!;
  const products = getProductsByDepartment("beauty");

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
