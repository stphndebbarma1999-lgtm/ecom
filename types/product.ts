export type Department = "men" | "women" | "beauty";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  department: Department;
  category: string; // category slug, e.g. "t-shirts"
  subcategory?: string;
  description: string;
  details?: string[];
  materialAndCare?: string[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  isNew: boolean;
  isBestSeller: boolean;
  tags: string[];
}

/** Fields the admin panel can create/edit. `id`, `slug` and `discountPercentage` are derived/generated. */
export interface ProductInput {
  slug?: string;
  name: string;
  brand: string;
  department: Department;
  category: string;
  subcategory?: string;
  description: string;
  details: string[];
  materialAndCare: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  isNew: boolean;
  isBestSeller: boolean;
  tags: string[];
}
