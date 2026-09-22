"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

interface ProductFormProps {
  action: (prevState: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
  categories: Category[];
  product?: Product;
  submitLabel: string;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-neutral-700">{label}</span>
      {children}
      {hint && <span className="text-xs text-neutral-400">{hint}</span>}
    </label>
  );
}

const inputClass =
  "border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900";

export default function ProductForm({ action, categories, product, submitLabel }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [department, setDepartment] = useState(product?.department ?? "men");
  const isBeauty = department === "beauty";

  const colorsText = product?.colors.map((c) => `${c.name}:${c.hex}`).join("\n") ?? "";

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Product Name">
          <input name="name" required defaultValue={product?.name} className={inputClass} />
        </Field>
        <Field label="Brand">
          <input name="brand" required defaultValue={product?.brand} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Department">
          <select
            name="department"
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value as Product["department"])}
            className={inputClass}
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="beauty">Beauty</option>
            <option value="footwear">Footwear</option>
            <option value="sunglasses">Sunglasses</option>
            <option value="watches">Watches</option>
          </select>
        </Field>
        <Field label="Category" hint="Must match an existing category slug, e.g. t-shirts">
          <input
            name="category"
            required
            list="category-options"
            defaultValue={product?.category}
            className={inputClass}
          />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={`${c.department}-${c.slug}`} value={c.slug}>
                {c.department} / {c.name}
              </option>
            ))}
          </datalist>
        </Field>
        <Field label="Subcategory (optional)">
          <input name="subcategory" defaultValue={product?.subcategory} className={inputClass} />
        </Field>
      </div>

      <Field label="Slug" hint="Leave blank to auto-generate from the product name">
        <input name="slug" defaultValue={product?.slug} className={inputClass} />
      </Field>

      <Field label="Description">
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={product?.description}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Product Details" hint="One bullet point per line">
          <textarea
            name="details"
            rows={4}
            defaultValue={product?.details?.join("\n")}
            className={inputClass}
          />
        </Field>
        {isBeauty ? (
          <Field label="Ingredients" hint="One per line">
            <textarea
              name="ingredients"
              rows={4}
              defaultValue={product?.ingredients?.join("\n")}
              className={inputClass}
            />
          </Field>
        ) : (
          <Field label="Material & Care" hint="One line per line">
            <textarea
              name="materialAndCare"
              rows={4}
              defaultValue={product?.materialAndCare?.join("\n")}
              className={inputClass}
            />
          </Field>
        )}
      </div>

      {isBeauty && (
        <Field label="How to Use" hint="One step per line">
          <textarea
            name="howToUse"
            rows={4}
            defaultValue={product?.howToUse?.join("\n")}
            className={inputClass}
          />
        </Field>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Price (₹)">
          <input
            name="price"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={product?.price}
            className={inputClass}
          />
        </Field>
        <Field label="Original Price (₹)" hint="Optional, for showing a discount">
          <input
            name="originalPrice"
            type="number"
            min="0"
            step="1"
            defaultValue={product?.originalPrice}
            className={inputClass}
          />
        </Field>
        <Field label="Rating">
          <input
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            defaultValue={product?.rating ?? 4.5}
            className={inputClass}
          />
        </Field>
        <Field label="Review Count">
          <input
            name="reviewCount"
            type="number"
            min="0"
            step="1"
            defaultValue={product?.reviewCount ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Stock">
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={product?.stock ?? 25}
            className={inputClass}
          />
        </Field>
        <Field label="Sizes" hint="Comma-separated, e.g. XS, S, M, L, XL, XXL">
          <input name="sizes" defaultValue={product?.sizes.join(", ")} className={inputClass} />
        </Field>
      </div>

      <Field label="Images" hint="One Sirv image URL per line — leave blank until you have real URLs">
        <textarea
          name="images"
          rows={4}
          defaultValue={product?.images.join("\n")}
          className={inputClass}
        />
      </Field>

      {!isBeauty && (
        <Field label="Colors" hint='One per line, format "Name:#hexcode" — e.g. Black:#111111'>
          <textarea name="colors" rows={3} defaultValue={colorsText} className={inputClass} />
        </Field>
      )}

      <Field label="Tags" hint="Comma-separated, used for search matching">
        <input name="tags" defaultValue={product?.tags.join(", ")} className={inputClass} />
      </Field>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input type="checkbox" name="isNew" defaultChecked={product?.isNew} />
          Mark as New
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input type="checkbox" name="isBestSeller" defaultChecked={product?.isBestSeller} />
          Mark as Best Seller
        </label>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center bg-neutral-900 px-6 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        <Link
          href="/admin/products"
          className="inline-flex h-11 items-center justify-center border border-neutral-300 px-6 text-sm font-medium text-neutral-900 hover:border-neutral-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
