import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Category, CategoryInput, DepartmentInfo } from "@/types/category";
import type { Department } from "@/types/product";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  department: Department;
  image: string | null;
  sort_order: number;
}

function mapRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    department: row.department,
    image: row.image ?? "",
    sortOrder: row.sort_order,
  };
}

const SELECT_COLUMNS = "id, name, slug, department, image, sort_order";

const DEPARTMENT_META: Record<Department, { name: string; heading: string; description: string }> = {
  men: {
    name: "Men",
    heading: "Men's Collection",
    description: "Clothing, footwear and accessories for men — from everyday essentials to formal wear.",
  },
  women: {
    name: "Women",
    heading: "Women's Collection",
    description: "Tops, ethnic wear, activewear and accessories curated for every occasion.",
  },
  beauty: {
    name: "Beauty",
    heading: "Beauty Edit",
    description: "Skincare, makeup, haircare and fragrance essentials.",
  },
};

export async function listAllCategories(): Promise<Category[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("categories")
    .select(SELECT_COLUMNS)
    .order("department", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return ((data as unknown as CategoryRow[]) ?? []).map(mapRow);
}

export async function listCategoriesByDepartment(department: string): Promise<Category[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("categories")
    .select(SELECT_COLUMNS)
    .eq("department", department)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return ((data as unknown as CategoryRow[]) ?? []).map(mapRow);
}

export async function getCategory(
  department: string,
  slug: string
): Promise<Category | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("categories")
    .select(SELECT_COLUMNS)
    .eq("department", department)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data as unknown as CategoryRow) : null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("categories")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data as unknown as CategoryRow) : null;
}

export async function getDepartmentInfo(department: Department): Promise<DepartmentInfo> {
  const categories = await listCategoriesByDepartment(department);
  const meta = DEPARTMENT_META[department];
  return { slug: department, ...meta, categories };
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const { data, error } = await getSupabaseAdmin()
    .from("categories")
    .insert({
      name: input.name,
      slug: input.slug,
      department: input.department,
      image: input.image || "",
      sort_order: input.sortOrder ?? 0,
    })
    .select(SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return mapRow(data as unknown as CategoryRow);
}

export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  const { data, error } = await getSupabaseAdmin()
    .from("categories")
    .update({
      name: input.name,
      slug: input.slug,
      department: input.department,
      image: input.image || "",
      sort_order: input.sortOrder ?? 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return mapRow(data as unknown as CategoryRow);
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin().from("categories").delete().eq("id", id);
  if (error) throw error;
}
