import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDepartment, getCategory, womenCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export function generateStaticParams() {
  return womenCategories.map((c) => ({ category: c.slug }));
}

type Params = Promise<{ category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory("women", categorySlug);
  if (!category) return {};
  return {
    title: `Women's ${category.name} Online | ${siteConfig.name}`,
    description: `Shop the latest women's ${category.name.toLowerCase()} at ${siteConfig.name}.`,
  };
}

export default async function WomenCategoryPage({ params }: { params: Params }) {
  const { category: categorySlug } = await params;
  const department = getDepartment("women")!;
  const category = getCategory("women", categorySlug);
  if (!category) notFound();

  const products = getProductsByCategory("women", categorySlug);

  return (
    <CategoryListing
      title={category.name}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Women", href: "/women" },
        { label: category.name },
      ]}
      products={products}
      allDepartmentCategories={department.categories}
      activeCategorySlug={category.slug}
      categoryBaseHref="/women"
    />
  );
}
