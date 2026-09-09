import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDepartment, getCategory, menCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { siteConfig } from "@/config/site";
import CategoryListing from "@/components/product/CategoryListing";

export function generateStaticParams() {
  return menCategories.map((c) => ({ category: c.slug }));
}

type Params = Promise<{ category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory("men", categorySlug);
  if (!category) return {};
  return {
    title: `Men's ${category.name} Online | ${siteConfig.name}`,
    description: `Shop the latest men's ${category.name.toLowerCase()} at ${siteConfig.name}.`,
  };
}

export default async function MenCategoryPage({ params }: { params: Params }) {
  const { category: categorySlug } = await params;
  const department = getDepartment("men")!;
  const category = getCategory("men", categorySlug);
  if (!category) notFound();

  const products = getProductsByCategory("men", categorySlug);

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
