import type { Metadata } from "next";
import { getDepartmentInfo } from "@/lib/db/categories";
import { getProductsByDepartment } from "@/lib/db/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Men's Fashion Online | ${siteConfig.name}`,
  description: "Shop men's t-shirts, shirts, jackets, jeans, footwear and accessories.",
};

export default async function MenPage() {
  const [department, products] = await Promise.all([
    getDepartmentInfo("men"),
    getProductsByDepartment("men"),
  ]);

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
