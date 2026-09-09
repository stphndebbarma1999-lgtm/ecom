import type { Category, DepartmentInfo } from "../types/category";

export const menCategories: Category[] = [
  { name: "T-Shirts", slug: "t-shirts", department: "men", image: "" },
  { name: "Shirts", slug: "shirts", department: "men", image: "" },
  { name: "Jackets", slug: "jackets", department: "men", image: "" },
  { name: "Jeans", slug: "jeans", department: "men", image: "" },
  { name: "Trousers", slug: "trousers", department: "men", image: "" },
  { name: "Formal Pants", slug: "formal-pants", department: "men", image: "" },
  { name: "Casual Shoes", slug: "casual-shoes", department: "men", image: "" },
  { name: "Formal Shoes", slug: "formal-shoes", department: "men", image: "" },
  { name: "Sports Shoes", slug: "sports-shoes", department: "men", image: "" },
  { name: "Watches", slug: "watches", department: "men", image: "" },
  { name: "Sunglasses", slug: "sunglasses", department: "men", image: "" },
];

export const womenCategories: Category[] = [
  { name: "Tops", slug: "tops", department: "women", image: "" },
  { name: "Jeans", slug: "jeans", department: "women", image: "" },
  { name: "Leggings", slug: "leggings", department: "women", image: "" },
  { name: "Kurta Sets", slug: "kurta-sets", department: "women", image: "" },
  { name: "Sarees", slug: "sarees", department: "women", image: "" },
  { name: "Jumpsuits & More", slug: "jumpsuits", department: "women", image: "" },
  { name: "Handbags", slug: "handbags", department: "women", image: "" },
  { name: "Sunglasses", slug: "sunglasses", department: "women", image: "" },
  { name: "Watches", slug: "watches", department: "women", image: "" },
  { name: "Footwear", slug: "footwear", department: "women", image: "" },
  { name: "Activewear", slug: "activewear", department: "women", image: "" },
];

export const beautyCategories: Category[] = [
  { name: "Skincare", slug: "skincare", department: "beauty", image: "" },
  { name: "Haircare", slug: "haircare", department: "beauty", image: "" },
  { name: "Makeup", slug: "makeup", department: "beauty", image: "" },
  { name: "Fragrance", slug: "fragrance", department: "beauty", image: "" },
  {
    name: "Hair Styling Devices",
    slug: "hair-styling-devices",
    department: "beauty",
    image: "",
  },
  { name: "Korean Beauty", slug: "korean-beauty", department: "beauty", image: "" },
];

export const departments: DepartmentInfo[] = [
  {
    slug: "men",
    name: "Men",
    heading: "Men's Collection",
    description:
      "Clothing, footwear and accessories for men — from everyday essentials to formal wear.",
    categories: menCategories,
  },
  {
    slug: "women",
    name: "Women",
    heading: "Women's Collection",
    description:
      "Tops, ethnic wear, activewear and accessories curated for every occasion.",
    categories: womenCategories,
  },
  {
    slug: "beauty",
    name: "Beauty",
    heading: "Beauty Edit",
    description: "Skincare, makeup, haircare and fragrance essentials.",
    categories: beautyCategories,
  },
];

export function getDepartment(slug: string): DepartmentInfo | undefined {
  return departments.find((d) => d.slug === slug);
}

export function getCategory(
  department: string,
  categorySlug: string
): Category | undefined {
  const dep = getDepartment(department);
  return dep?.categories.find((c) => c.slug === categorySlug);
}

export const allCategories: Category[] = [
  ...menCategories,
  ...womenCategories,
  ...beautyCategories,
];
