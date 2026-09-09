"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Category } from "@/types/category";

interface CategoryFormProps {
  action: (prevState: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
  category?: Category;
  submitLabel: string;
}

const inputClass =
  "border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900";

export default function CategoryForm({ action, category, submitLabel }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-neutral-700">Department</span>
        <select
          name="department"
          required
          defaultValue={category?.department ?? "men"}
          className={inputClass}
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="beauty">Beauty</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-neutral-700">Name</span>
        <input name="name" required defaultValue={category?.name} className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-neutral-700">Slug</span>
        <input name="slug" defaultValue={category?.slug} className={inputClass} />
        <span className="text-xs text-neutral-400">
          Leave blank to auto-generate. This becomes the URL: /department/slug
        </span>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-neutral-700">Image URL</span>
        <input name="image" defaultValue={category?.image} className={inputClass} />
        <span className="text-xs text-neutral-400">Sirv URL — leave blank for a placeholder</span>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-neutral-700">Sort Order</span>
        <input
          name="sortOrder"
          type="number"
          defaultValue={category?.sortOrder ?? 0}
          className={inputClass}
        />
      </label>

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
          href="/admin/categories"
          className="inline-flex h-11 items-center justify-center border border-neutral-300 px-6 text-sm font-medium text-neutral-900 hover:border-neutral-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
