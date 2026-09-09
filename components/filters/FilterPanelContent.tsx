"use client";

import type { ProductFilters } from "@/types/filters";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

const PRICE_BRACKETS = [
  { label: "Under ₹1,000", min: 0, max: 999 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 – ₹3,500", min: 2000, max: 3500 },
  { label: "Above ₹3,500", min: 3500, max: undefined },
];

const RATINGS = [4, 3, 2];
const DISCOUNTS = [10, 20, 30, 50];

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-neutral-200 py-5 first:pt-0 last:border-0">
      <h3 className="mb-3 text-sm font-semibold text-neutral-900">{title}</h3>
      {children}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-neutral-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded-none border-neutral-300 text-neutral-900 focus:ring-neutral-900"
      />
      <span className={cn(checked && "font-medium text-neutral-900")}>{label}</span>
    </label>
  );
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function FilterPanelContent({
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
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
  const colors = Array.from(new Set(products.flatMap((p) => p.colors.map((c) => c.name)))).sort();
  const sizes = Array.from(new Set(products.flatMap((p) => p.sizes))).sort();

  return (
    <div className="flex flex-col">
      {categories && categories.length > 0 && (
        <FilterGroup title="Category">
          {categories.map((c) => (
            <Checkbox
              key={c.slug}
              label={c.name}
              checked={filters.categories.includes(c.slug)}
              onChange={() =>
                onChange({ ...filters, categories: toggle(filters.categories, c.slug) })
              }
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Price">
        {PRICE_BRACKETS.map((bracket) => {
          const checked = filters.minPrice === bracket.min && filters.maxPrice === bracket.max;
          return (
            <Checkbox
              key={bracket.label}
              label={bracket.label}
              checked={checked}
              onChange={() =>
                onChange(
                  checked
                    ? { ...filters, minPrice: undefined, maxPrice: undefined }
                    : { ...filters, minPrice: bracket.min, maxPrice: bracket.max }
                )
              }
            />
          );
        })}
      </FilterGroup>

      {brands.length > 1 && (
        <FilterGroup title="Brand">
          {brands.map((brand) => (
            <Checkbox
              key={brand}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => onChange({ ...filters, brands: toggle(filters.brands, brand) })}
            />
          ))}
        </FilterGroup>
      )}

      {sizes.length > 1 && sizes[0] !== "One Size" && (
        <FilterGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const checked = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, size) })}
                  className={cn(
                    "flex h-9 min-w-9 items-center justify-center border px-2 text-xs font-medium",
                    checked
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 text-neutral-600 hover:border-neutral-900"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      {colors.length > 1 && (
        <FilterGroup title="Color">
          {colors.map((color) => (
            <Checkbox
              key={color}
              label={color}
              checked={filters.colors.includes(color)}
              onChange={() => onChange({ ...filters, colors: toggle(filters.colors, color) })}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Rating">
        {RATINGS.map((rating) => (
          <Checkbox
            key={rating}
            label={`${rating}★ & above`}
            checked={filters.minRating === rating}
            onChange={() =>
              onChange({
                ...filters,
                minRating: filters.minRating === rating ? undefined : rating,
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Discount">
        {DISCOUNTS.map((discount) => (
          <Checkbox
            key={discount}
            label={`${discount}% or more`}
            checked={filters.minDiscount === discount}
            onChange={() =>
              onChange({
                ...filters,
                minDiscount: filters.minDiscount === discount ? undefined : discount,
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <Checkbox
          label="In Stock Only"
          checked={Boolean(filters.inStockOnly)}
          onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
        />
      </FilterGroup>
    </div>
  );
}
