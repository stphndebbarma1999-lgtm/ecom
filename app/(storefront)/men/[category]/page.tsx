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
  const category = await getCategory("men", categorySlug);
  if (!category) return {};
  return {
    title: `Men's ${category.name} Online | ${siteConfig.name}`,
    description: `Shop the latest men's ${category.name.toLowerCase()} at ${siteConfig.name}.`,
  };
}

export default async function MenCategoryPage({ params }: { params: Params }) {
  const { category: categorySlug } = await params;
  const [department, category] = await Promise.all([
    getDepartmentInfo("men"),
    getCategory("men", categorySlug),
  ]);
  if (!category) notFound();

  const products = await getProductsByCategory("men", categorySlug);

  return (
    <CategoryListing
      title={category.name}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Men", href: "/men" },
        { label: category.name },
      ]}
      products={products}
      allDepartmentCategories={department.categories}
      activeCategorySlug={category.slug}
      categoryBaseHref="/men"
    />
  );
}
