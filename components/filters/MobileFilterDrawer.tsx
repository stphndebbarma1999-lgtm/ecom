"use client";

import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import FilterPanelContent from "@/components/filters/FilterPanelContent";
import type { ProductFilters } from "@/types/filters";
import { defaultFilters } from "@/types/filters";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export default function MobileFilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  categories,
  products,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  categories?: Category[];
  products: Product[];
  resultCount: number;
}) {
  return (
    <Drawer open={open} onClose={onClose} title="Filters" side="left">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-5">
          <FilterPanelContent
            filters={filters}
            onChange={onChange}
            categories={categories}
            products={products}
          />
        </div>
        <div className="flex gap-2 border-t border-neutral-200 p-4">
          <Button variant="outline" size="md" className="flex-1" onClick={() => onChange(defaultFilters)}>
            Clear All
          </Button>
          <Button variant="primary" size="md" className="flex-1" onClick={onClose}>
            Show {resultCount} results
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
