"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import { defaultFilters, type ProductFilters, type SortOption } from "@/types/filters";
import { applyFilters, sortProducts } from "@/lib/filterProducts";
import Breadcrumb, { type Crumb } from "@/components/ui/Breadcrumb";
import FilterSidebar from "@/components/filters/FilterSidebar";
import MobileFilterDrawer from "@/components/filters/MobileFilterDrawer";
import SortDropdown from "@/components/filters/SortDropdown";
import ProductGrid from "@/components/product/ProductGrid";
import { cn } from "@/lib/utils";

export default function CategoryListing({
  title,
  description,
  breadcrumb,
  products,
  allDepartmentCategories,
  activeCategorySlug,
  categoryBaseHref,
}: {
  title: string;
  description?: string;
  breadcrumb: Crumb[];
  products: Product[];
  allDepartmentCategories?: Category[];
  activeCategorySlug?: string;
  categoryBaseHref: string;
}) {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredSorted = useMemo(
    () => sortProducts(applyFilters(products, filters), sort),
    [products, filters, sort]
  );

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.minPrice !== undefined ? 1 : 0) +
    (filters.minRating !== undefined ? 1 : 0) +
    (filters.minDiscount !== undefined ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  return (
    <div className="container-nova py-6 lg:py-10">
      <Breadcrumb items={breadcrumb} />

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            {title}
          </h1>
          {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
        </div>
        <p className="text-sm text-neutral-500">{filteredSorted.length} products</p>
      </div>

      {allDepartmentCategories && allDepartmentCategories.length > 0 && (
        <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
          <Link
            href={categoryBaseHref}
            className={cn(
              "shrink-0 border px-4 py-2 text-xs font-medium",
              !activeCategorySlug
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-900"
            )}
          >
            All
          </Link>
          {allDepartmentCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`${categoryBaseHref}/${cat.slug}`}
              className={cn(
                "shrink-0 border px-4 py-2 text-xs font-medium",
                activeCategorySlug === cat.slug
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-900"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3 border-y border-neutral-200 py-3 lg:justify-end">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-neutral-900 lg:hidden"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <div className="mt-6 flex gap-10">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          categories={allDepartmentCategories}
          products={products}
        />

        <div className="flex-1">
          <ProductGrid products={filteredSorted} />
        </div>
      </div>

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
        categories={allDepartmentCategories}
        products={products}
        resultCount={filteredSorted.length}
      />
    </div>
  );
}
