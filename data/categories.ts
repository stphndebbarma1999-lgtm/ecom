import type { Category, DepartmentInfo } from "../types/category";

export const menCategories: Category[] = [
  { name: "T-Shirts", slug: "t-shirts", department: "men", image: "" },
  { name: "Shirts", slug: "shirts", department: "men", image: "" },
  { name: "Jackets", slug: "jackets", department: "men", image: "" },
  { name: "Jeans", slug: "jeans", department: "men", image: "" },
  { name: "Trousers", slug: "trousers", department: "men", image: "" },
  { name: "Formal Pants", slug: "formal-pants", department: "men", image: "" },
];

export const womenCategories: Category[] = [
  { name: "Tops", slug: "tops", department: "women", image: "" },
  { name: "Jeans", slug: "jeans", department: "women", image: "" },
  { name: "Leggings", slug: "leggings", department: "women", image: "" },
  { name: "Kurta Sets", slug: "kurta-sets", department: "women", image: "" },
  { name: "Sarees", slug: "sarees", department: "women", image: "" },
  { name: "Jumpsuits & More", slug: "jumpsuits", department: "women", image: "" },
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

export const footwearCategories: Category[] = [
  { name: "Men's Casual Shoes", slug: "men-casual-shoes", department: "footwear", image: "" },
  { name: "Men's Formal Shoes", slug: "men-formal-shoes", department: "footwear", image: "" },
  { name: "Men's Loafers", slug: "men-loafers", department: "footwear", image: "" },
  { name: "Men's Sneakers", slug: "men-sneakers", department: "footwear", image: "" },
  { name: "Men's Sports Shoes", slug: "men-sports-shoes", department: "footwear", image: "" },
  {
    name: "Men's Sandals & Floaters",
    slug: "men-sandals-floaters",
    department: "footwear",
    image: "",
  },
  { name: "Men's Slippers", slug: "men-slippers", department: "footwear", image: "" },
  { name: "Women's Sandals", slug: "women-sandals", department: "footwear", image: "" },
  { name: "Women's Flats", slug: "women-flats", department: "footwear", image: "" },
  { name: "Women's Heels", slug: "women-heels", department: "footwear", image: "" },
  {
    name: "Women's Casual Shoes",
    slug: "women-casual-shoes",
    department: "footwear",
    image: "",
  },
  { name: "Women's Sneakers", slug: "women-sneakers", department: "footwear", image: "" },
  {
    name: "Women's Sports Shoes",
    slug: "women-sports-shoes",
    department: "footwear",
    image: "",
  },
  { name: "Women's Slippers", slug: "women-slippers", department: "footwear", image: "" },
];

export const sunglassesCategories: Category[] = [
  { name: "Men", slug: "men", department: "sunglasses", image: "" },
  { name: "Women", slug: "women", department: "sunglasses", image: "" },
];

export const watchesCategories: Category[] = [
  { name: "Analog Watches", slug: "analog-watches", department: "watches", image: "" },
  { name: "Sports Watches", slug: "sports-watches", department: "watches", image: "" },
  { name: "Smart Watches", slug: "smart-watches", department: "watches", image: "" },
];

export const departments: DepartmentInfo[] = [
  {
    slug: "men",
    name: "Men",
    heading: "Men's Collection",
    description:
      "Clothing and accessories for men — from everyday essentials to formal wear.",
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
  {
    slug: "footwear",
    name: "Footwear",
    heading: "Footwear",
    description: "Shoes, sandals and slippers for men and women.",
    categories: footwearCategories,
  },
  {
    slug: "sunglasses",
    name: "Sunglasses",
    heading: "Sunglasses",
    description: "Sunglasses for men and women.",
    categories: sunglassesCategories,
  },
  {
    slug: "watches",
    name: "Watches",
    heading: "Watches",
    description: "Analog, sports and smart watches.",
    categories: watchesCategories,
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
  ...footwearCategories,
  ...sunglassesCategories,
  ...watchesCategories,
];
