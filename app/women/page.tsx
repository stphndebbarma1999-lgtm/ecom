import type { Metadata } from "next";
import { getDepartment } from "@/data/categories";
import { getProductsByDepartment } from "@/data/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const metadata: Metadata = {
  title: `Women's Fashion Online | ${siteConfig.name}`,
  description: "Shop women's tops, ethnic wear, activewear, footwear and accessories.",
};

export default function WomenPage() {
  const department = getDepartment("women")!;
  const products = getProductsByDepartment("women");

  return (
    <CategoryListing
      title={department.heading}
      description={department.description}
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Women" }]}
      products={products}
      allDepartmentCategories={department.categories}
      categoryBaseHref="/women"
    />
  );
}
