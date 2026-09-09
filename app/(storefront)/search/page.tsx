import type { Metadata } from "next";
import { searchProducts } from "@/lib/db/products";
import { siteConfig } from "@/config/site";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SearchBar from "@/components/search/SearchBar";
import ProductGrid from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Search | ${siteConfig.name}`,
};

type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchProducts(q) : [];

  return (
    <div className="container-nova py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        {q ? `Results for "${q}"` : "Search"}
      </h1>

      <div className="mt-5 max-w-xl">
        <SearchBar initialQuery={q} />
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        {q ? `${results.length} products found` : "Enter a search term to get started."}
      </p>

      <div className="mt-6">
        <ProductGrid products={results} />
      </div>
    </div>
  );
}
