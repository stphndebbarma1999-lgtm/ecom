/**
 * One-off script that seeds Supabase with the original mock catalog
 * (data/categories.ts + data/products.ts).
 *
 * IMPORTANT: this only ever INSERTS rows that don't already exist
 * (ignoreDuplicates: true on conflict). It must never update existing
 * rows — once real products are being managed through /admin, a plain
 * upsert here would silently overwrite admin-entered data (images,
 * price, description, anything) for any row whose slug happens to
 * match one of these seed products. Re-running this script is only
 * meant to backfill categories/products that don't exist yet.
 *
 * Usage: npm run seed
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { menCategories, womenCategories, beautyCategories } from "../data/categories";
import { products } from "../data/products";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = resolve(__dirname, "..", ".env.local");
  if (!existsSync(envPath)) {
    console.error(".env.local not found. Copy .env.local.example to .env.local and fill it in first.");
    process.exit(1);
  }
  const contents = readFileSync(envPath, "utf-8");
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey);

  const allCategories = [...menCategories, ...womenCategories, ...beautyCategories];
  console.log(`Seeding ${allCategories.length} categories...`);
  const { error: catError } = await supabase
    .from("categories")
    .upsert(
      allCategories.map((c, i) => ({
        name: c.name,
        slug: c.slug,
        department: c.department,
        image: c.image || "",
        sort_order: i,
      })),
      { onConflict: "department,slug", ignoreDuplicates: true }
    );
  if (catError) throw catError;
  console.log("Categories seeded.");

  console.log(`Seeding ${products.length} products...`);
  const { error: productError } = await supabase.from("products").upsert(
    products.map((p) => ({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      department: p.department,
      category: p.category,
      subcategory: p.subcategory || null,
      description: p.description,
      details: p.details ?? [],
      material_and_care: p.materialAndCare ?? [],
      price: p.price,
      original_price: p.originalPrice ?? null,
      rating: p.rating,
      review_count: p.reviewCount,
      images: p.images,
      colors: p.colors,
      sizes: p.sizes,
      stock: p.stock,
      is_new: p.isNew,
      is_best_seller: p.isBestSeller,
      tags: p.tags,
    })),
    { onConflict: "slug", ignoreDuplicates: true }
  );
  if (productError) throw productError;
  console.log("Products seeded.");

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
