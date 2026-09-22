import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDepartmentInfo, getCategory } from "@/lib/db/categories";
import { getProductsByCategory } from "@/lib/db/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export const dynamic = "force-dynamic";

type Params = Promise<{ category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategory("sunglasses", categorySlug);
  if (!category) return {};
  return {
    title: `${category.name}'s Sunglasses | ${siteConfig.name}`,
    description: `Shop ${category.name.toLowerCase()}'s sunglasses at ${siteConfig.name}.`,
  };
}

export default async function SunglassesCategoryPage({ params }: { params: Params }) {
  const { category: categorySlug } = await params;
  const [department, category] = await Promise.all([
    getDepartmentInfo("sunglasses"),
    getCategory("sunglasses", categorySlug),
  ]);
  if (!category) notFound();

  const products = await getProductsByCategory("sunglasses", categorySlug);

  return (
    <CategoryListing
      title={category.name}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Sunglasses", href: "/sunglasses" },
        { label: category.name },
      ]}
      products={products}
      allDepartmentCategories={department.categories}
      activeCategorySlug={category.slug}
      categoryBaseHref="/sunglasses"
    />
  );
}
