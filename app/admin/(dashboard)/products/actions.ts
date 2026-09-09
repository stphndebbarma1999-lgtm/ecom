"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProduct, deleteProduct, updateProduct } from "@/lib/db/products";
import type { ProductInput, ProductColor } from "@/types/product";

function splitLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitCommas(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseColors(value: FormDataEntryValue | null): ProductColor[] {
  return splitLines(value)
    .map((line) => {
      const [name, hex] = line.split(":").map((s) => s.trim());
      if (!name || !hex) return null;
      return { name, hex: hex.startsWith("#") ? hex : `#${hex}` };
    })
    .filter((c): c is ProductColor => Boolean(c));
}

function buildProductInput(formData: FormData): ProductInput {
  const price = Number(formData.get("price"));
  const originalPriceRaw = String(formData.get("originalPrice") ?? "").trim();

  return {
    slug: String(formData.get("slug") ?? "").trim() || undefined,
    name: String(formData.get("name") ?? "").trim(),
    brand: String(formData.get("brand") ?? "").trim(),
    department: String(formData.get("department") ?? "men") as ProductInput["department"],
    category: String(formData.get("category") ?? "").trim(),
    subcategory: String(formData.get("subcategory") ?? "").trim() || undefined,
    description: String(formData.get("description") ?? "").trim(),
    details: splitLines(formData.get("details")),
    materialAndCare: splitLines(formData.get("materialAndCare")),
    price,
    originalPrice: originalPriceRaw ? Number(originalPriceRaw) : undefined,
    rating: Number(formData.get("rating") ?? 0),
    reviewCount: Number(formData.get("reviewCount") ?? 0),
    images: splitLines(formData.get("images")),
    colors: parseColors(formData.get("colors")),
    sizes: splitCommas(formData.get("sizes")),
    stock: Number(formData.get("stock") ?? 0),
    isNew: formData.get("isNew") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
    tags: splitCommas(formData.get("tags")),
  };
}

function validate(input: ProductInput): string | null {
  if (!input.name) return "Product name is required.";
  if (!input.brand) return "Brand is required.";
  if (!input.category) return "Category is required.";
  if (!input.description) return "Description is required.";
  if (!Number.isFinite(input.price) || input.price <= 0) return "Price must be a positive number.";
  if (
    input.originalPrice !== undefined &&
    (!Number.isFinite(input.originalPrice) || input.originalPrice <= 0)
  ) {
    return "Original price must be a positive number.";
  }
  if (!Number.isFinite(input.stock) || input.stock < 0) return "Stock must be zero or more.";
  return null;
}

function revalidateStorefront(input: ProductInput, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/new-arrivals");
  revalidatePath("/best-sellers");
  revalidatePath(`/${input.department}`);
  revalidatePath(`/${input.department}/${input.category}`);
  if (input.slug) revalidatePath(`/product/${input.slug}`);
  if (previousSlug && previousSlug !== input.slug) revalidatePath(`/product/${previousSlug}`);
}

export async function createProductAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const input = buildProductInput(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  try {
    const product = await createProduct(input);
    revalidateStorefront({ ...input, slug: product.slug });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create product." };
  }

  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  previousSlug: string,
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const input = buildProductInput(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  try {
    const product = await updateProduct(id, input);
    revalidateStorefront({ ...input, slug: product.slug }, previousSlug);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update product." };
  }

  redirect("/admin/products");
}

export async function deleteProductAction(id: string, slug: string, department: string, category: string) {
  await deleteProduct(id);
  revalidatePath("/");
  revalidatePath("/new-arrivals");
  revalidatePath("/best-sellers");
  revalidatePath(`/${department}`);
  revalidatePath(`/${department}/${category}`);
  revalidatePath(`/product/${slug}`);
  revalidatePath("/admin/products");
}
