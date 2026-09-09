import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDepartment, getCategory, beautyCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export function generateStaticParams() {
  return beautyCategories.map((c) => ({ category: c.slug }));
}

type Params = Promise<{ category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory("beauty", categorySlug);
  if (!category) return {};
  return {
    title: `${category.name} Products | ${siteConfig.name}`,
    description: `Shop ${category.name.toLowerCase()} essentials at ${siteConfig.name}.`,
  };
}

export default async function BeautyCategoryPage({ params }: { params: Params }) {
  const { category: categorySlug } = await params;
  const department = getDepartment("beauty")!;
  const category = getCategory("beauty", categorySlug);
  if (!category) notFound();

  const products = getProductsByCategory("beauty", categorySlug);

  return (
    <CategoryListing
      title={category.name}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Beauty", href: "/beauty" },
        { label: category.name },
      ]}
      products={products}
      allDepartmentCategories={department.categories}
      activeCategorySlug={category.slug}
      categoryBaseHref="/beauty"
    />
  );
}
