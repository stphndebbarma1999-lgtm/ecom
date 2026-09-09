import type { Product } from "@/types/product";
import type { ProductFilters, SortOption } from "@/types/filters";

export function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((p) => {
    if (filters.categories.length && !filters.categories.includes(p.category)) return false;
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
    if (
      filters.colors.length &&
      !p.colors.some((c) => filters.colors.includes(c.name))
    )
      return false;
    if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
    if (typeof filters.minPrice === "number" && p.price < filters.minPrice) return false;
    if (typeof filters.maxPrice === "number" && p.price > filters.maxPrice) return false;
    if (typeof filters.minRating === "number" && p.rating < filters.minRating) return false;
    if (
      typeof filters.minDiscount === "number" &&
      (p.discountPercentage ?? 0) < filters.minDiscount
    )
      return false;
    if (filters.inStockOnly && p.stock <= 0) return false;
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "best-selling":
      return list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    case "top-rated":
      return list.sort((a, b) => b.rating - a.rating);
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    default:
      return list;
  }
}
