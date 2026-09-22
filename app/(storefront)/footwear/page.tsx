import type { Metadata } from "next";
import { getDepartmentInfo } from "@/lib/db/categories";
import { getProductsByDepartment } from "@/lib/db/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Footwear Online | ${siteConfig.name}`,
  description: "Shop shoes, sandals, sneakers and slippers for men and women.",
};

export default async function FootwearPage() {
  const [department, products] = await Promise.all([
    getDepartmentInfo("footwear"),
    getProductsByDepartment("footwear"),
  ]);

  return (
    <CategoryListing
      title={department.heading}
      description={department.description}
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Footwear" }]}
      products={products}
      allDepartmentCategories={department.categories}
      categoryBaseHref="/footwear"
    />
  );
}
