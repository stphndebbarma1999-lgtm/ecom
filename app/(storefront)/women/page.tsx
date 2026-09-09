import type { Metadata } from "next";
import { getDepartmentInfo } from "@/lib/db/categories";
import { getProductsByDepartment } from "@/lib/db/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Women's Fashion Online | ${siteConfig.name}`,
  description: "Shop women's tops, ethnic wear, activewear, footwear and accessories.",
};

export default async function WomenPage() {
  const [department, products] = await Promise.all([
    getDepartmentInfo("women"),
    getProductsByDepartment("women"),
  ]);

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
