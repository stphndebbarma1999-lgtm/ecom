import type { ProductFilters } from "@/types/filters";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import FilterPanelContent from "@/components/filters/FilterPanelContent";

export default function FilterSidebar({
  filters,
  onChange,
  categories,
  products,
}: {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  categories?: Category[];
  products: Product[];
}) {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-900">
        Filters
      </h2>
      <FilterPanelContent
        filters={filters}
        onChange={onChange}
        categories={categories}
        products={products}
      />
    </aside>
  );
}
