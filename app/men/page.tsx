import type { Metadata } from "next";
import { getDepartment } from "@/data/categories";
import { getProductsByDepartment } from "@/data/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const metadata: Metadata = {
  title: `Men's Fashion Online | ${siteConfig.name}`,
  description: "Shop men's t-shirts, shirts, jackets, jeans, footwear and accessories.",
};

export default function MenPage() {
  const department = getDepartment("men")!;
  const products = getProductsByDepartment("men");

  return (
    <CategoryListing
      title={department.heading}
      description={department.description}
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Men" }]}
      products={products}
      allDepartmentCategories={department.categories}
      categoryBaseHref="/men"
    />
  );
}
