"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCategory, deleteCategory, updateCategory } from "@/lib/db/categories";
import type { CategoryInput } from "@/types/category";
import type { Department } from "@/types/product";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildInput(formData: FormData): CategoryInput {
  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  return {
    name,
    slug: slugRaw || slugify(name),
    department: String(formData.get("department") ?? "men") as Department,
    image: String(formData.get("image") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

function validate(input: CategoryInput): string | null {
  if (!input.name) return "Category name is required.";
  if (!input.slug) return "Slug is required.";
  return null;
}

export async function createCategoryAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const input = buildInput(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  try {
    await createCategory(input);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create category." };
  }

  revalidatePath(`/${input.department}`);
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategoryAction(
  id: string,
  previousDepartment: string,
  previousSlug: string,
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const input = buildInput(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  try {
    await updateCategory(id, input);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update category." };
  }

  revalidatePath(`/${input.department}`);
  revalidatePath(`/${input.department}/${input.slug}`);
  if (previousDepartment !== input.department || previousSlug !== input.slug) {
    revalidatePath(`/${previousDepartment}`);
    revalidatePath(`/${previousDepartment}/${previousSlug}`);
  }
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(id: string, department: string, slug: string) {
  await deleteCategory(id);
  revalidatePath(`/${department}`);
  revalidatePath(`/${department}/${slug}`);
  revalidatePath("/admin/categories");
}
