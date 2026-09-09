import Link from "next/link";
import { Plus } from "lucide-react";
import { listAllCategories } from "@/lib/db/categories";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteCategoryAction } from "./actions";

export const dynamic = "force-dynamic";

const departmentLabel: Record<string, string> = { men: "Men", women: "Women", beauty: "Beauty" };

export default async function AdminCategoriesPage() {
  const categories = await listAllCategories();
  const grouped = {
    men: categories.filter((c) => c.department === "men"),
    women: categories.filter((c) => c.department === "women"),
    beauty: categories.filter((c) => c.department === "beauty"),
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Categories</h1>
          <p className="mt-1 text-sm text-neutral-500">{categories.length} total</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex h-10 items-center gap-2 bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <Plus size={16} />
          Add Category
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-8">
        {(Object.keys(grouped) as (keyof typeof grouped)[]).map((department) => (
          <div key={department}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
              {departmentLabel[department]}
            </h2>
            <div className="mt-3 overflow-x-auto border border-neutral-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">URL</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {grouped[department].map((category) => (
                    <tr key={category.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-neutral-900">{category.name}</td>
                      <td className="px-4 py-3 text-neutral-600">{category.slug}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/${department}/${category.slug}`}
                          target="_blank"
                          className="text-neutral-500 hover:underline"
                        >
                          /{department}/{category.slug}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/categories/${category.id}/edit`}
                            className="rounded px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                          >
                            Edit
                          </Link>
                          <DeleteButton
                            action={deleteCategoryAction.bind(
                              null,
                              category.id!,
                              category.department,
                              category.slug
                            )}
                            confirmMessage={`Delete "${category.name}"? Products in this category will remain but the category page will 404.`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {grouped[department].length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-neutral-400">
                        No categories yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
