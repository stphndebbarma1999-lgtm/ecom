export type SortOption =
  | "recommended"
  | "newest"
  | "best-selling"
  | "top-rated"
  | "price-asc"
  | "price-desc";

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best Selling" },
  { value: "top-rated", label: "Top Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export interface ProductFilters {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minDiscount?: number;
  inStockOnly?: boolean;
}

export const defaultFilters: ProductFilters = {
  categories: [],
  brands: [],
  colors: [],
  sizes: [],
};
