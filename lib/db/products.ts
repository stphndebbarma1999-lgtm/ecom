import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { discountPercentage } from "@/lib/utils";
import type { Product, ProductInput } from "@/types/product";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  department: Product["department"];
  category: string;
  subcategory: string | null;
  description: string;
  details: string[] | null;
  material_and_care: string[] | null;
  ingredients: string[] | null;
  how_to_use: string[] | null;
  price: number;
  original_price: number | null;
  rating: number;
  review_count: number;
  images: string[] | null;
  colors: Product["colors"] | null;
  sizes: string[] | null;
  stock: number;
  is_new: boolean;
  is_best_seller: boolean;
  tags: string[] | null;
}

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    department: row.department,
    category: row.category,
    subcategory: row.subcategory ?? undefined,
    description: row.description,
    details: row.details ?? undefined,
    materialAndCare: row.material_and_care ?? undefined,
    ingredients: row.ingredients ?? undefined,
    howToUse: row.how_to_use ?? undefined,
    price: Number(row.price),
    originalPrice: row.original_price !== null ? Number(row.original_price) : undefined,
    discountPercentage: discountPercentage(
      Number(row.price),
      row.original_price !== null ? Number(row.original_price) : undefined
    ),
    rating: Number(row.rating),
    reviewCount: row.review_count,
    images: row.images ?? [],
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    stock: row.stock,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    tags: row.tags ?? [],
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function inputToRow(input: ProductInput) {
  return {
    slug: input.slug?.trim() || slugify(input.name),
    name: input.name,
    brand: input.brand,
    department: input.department,
    category: input.category,
    subcategory: input.subcategory || null,
    description: input.description,
    details: input.details,
    material_and_care: input.materialAndCare,
    ingredients: input.ingredients,
    how_to_use: input.howToUse,
    price: input.price,
    original_price: input.originalPrice ?? null,
    rating: input.rating,
    review_count: input.reviewCount,
    images: input.images,
    colors: input.colors,
    sizes: input.sizes,
    stock: input.stock,
    is_new: input.isNew,
    is_best_seller: input.isBestSeller,
    tags: input.tags,
  };
}

const SELECT_COLUMNS =
  "id, slug, name, brand, department, category, subcategory, description, details, material_and_care, ingredients, how_to_use, price, original_price, rating, review_count, images, colors, sizes, stock, is_new, is_best_seller, tags";

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(SELECT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data as unknown as ProductRow) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data as unknown as ProductRow) : null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(SELECT_COLUMNS)
    .in("id", ids);

  if (error) throw error;
  const rows = (data as unknown as ProductRow[]) ?? [];
  // preserve the caller's ordering (e.g. most-recently-viewed first)
  const bySlugId = new Map(rows.map((r) => [r.id, mapRow(r)]));
  return ids.map((id) => bySlugId.get(id)).filter((p): p is Product => Boolean(p));
}

export async function getProductsByDepartment(department: string): Promise<Product[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(SELECT_COLUMNS)
    .eq("department", department)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data as unknown as ProductRow[]) ?? []).map(mapRow);
}

export async function getProductsByCategory(
  department: string,
  category: string
): Promise<Product[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(SELECT_COLUMNS)
    .eq("department", department)
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data as unknown as ProductRow[]) ?? []).map(mapRow);
}

export async function getNewArrivals(limit?: number): Promise<Product[]> {
  let query = getSupabaseAdmin()
    .from("products")
    .select(SELECT_COLUMNS)
    .eq("is_new", true)
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  // Homepage-critical: a transient Supabase blip here must not crash the
  // whole page — degrade to an empty section instead (see also
  // getBestSellers and getHomepageContent, same reasoning).
  try {
    const { data, error } = await query;
    if (error) throw error;
    return ((data as unknown as ProductRow[]) ?? []).map(mapRow);
  } catch (err) {
    console.error("getNewArrivals failed:", err);
    return [];
  }
}

export async function getBestSellers(limit?: number): Promise<Product[]> {
  let query = getSupabaseAdmin()
    .from("products")
    .select(SELECT_COLUMNS)
    .eq("is_best_seller", true)
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  try {
    const { data, error } = await query;
    if (error) throw error;
    return ((data as unknown as ProductRow[]) ?? []).map(mapRow);
  } catch (err) {
    console.error("getBestSellers failed:", err);
    return [];
  }
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(SELECT_COLUMNS)
    .eq("department", product.department)
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(limit);

  if (error) throw error;
  return ((data as unknown as ProductRow[]) ?? []).map(mapRow);
}

export async function searchProducts(query: string, limit = 20): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];
  const pattern = `%${q}%`;

  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(SELECT_COLUMNS)
    .or(
      `name.ilike.${pattern},brand.ilike.${pattern},category.ilike.${pattern},department.ilike.${pattern}`
    )
    .limit(limit);

  if (error) throw error;
  return ((data as unknown as ProductRow[]) ?? []).map(mapRow);
}

export interface AdminProductListOptions {
  search?: string;
  department?: string;
  page?: number;
  pageSize?: number;
}

export async function listProductsForAdmin(options: AdminProductListOptions = {}) {
  const { search, department, page = 1, pageSize = 20 } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = getSupabaseAdmin()
    .from("products")
    .select(SELECT_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (department) query = query.eq("department", department);
  if (search) query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    products: ((data as unknown as ProductRow[]) ?? []).map(mapRow),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .insert(inputToRow(input))
    .select(SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return mapRow(data as unknown as ProductRow);
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .update({ ...inputToRow(input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return mapRow(data as unknown as ProductRow);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin().from("products").delete().eq("id", id);
  if (error) throw error;
}
