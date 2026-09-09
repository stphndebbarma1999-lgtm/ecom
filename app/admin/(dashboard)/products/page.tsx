import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { listProductsForAdmin } from "@/lib/db/products";
import { formatPrice } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteProductAction } from "./actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { products, total } = await listProductsForAdmin({
    search: q || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Products</h1>
          <p className="mt-1 text-sm text-neutral-500">{total} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center gap-2 bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <form className="mt-5 flex max-w-sm items-center gap-2 border border-neutral-300 px-3 py-2">
        <Search size={16} className="text-neutral-400" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name or brand..."
          className="flex-1 border-0 text-sm outline-none"
        />
      </form>

      <div className="mt-5 overflow-x-auto border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50">
                <td className="max-w-64 truncate px-4 py-3 font-medium text-neutral-900">
                  {product.name}
                  <span className="ml-2 text-xs font-normal text-neutral-400">{product.brand}</span>
                </td>
                <td className="px-4 py-3 capitalize text-neutral-600">{product.department}</td>
                <td className="px-4 py-3 text-neutral-600">{product.category}</td>
                <td className="px-4 py-3 font-medium text-neutral-900">{formatPrice(product.price)}</td>
                <td className="px-4 py-3 text-neutral-600">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {product.isNew && (
                      <span className="bg-neutral-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                        New
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                        Best
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteProductAction.bind(
                        null,
                        product.id,
                        product.slug,
                        product.department,
                        product.category
                      )}
                      confirmMessage={`Delete "${product.name}"? This can't be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-neutral-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            const params = new URLSearchParams({ ...(q ? { q } : {}), page: String(p) });
            return (
              <Link
                key={p}
                href={`/admin/products?${params.toString()}`}
                className={
                  p === page
                    ? "flex h-8 w-8 items-center justify-center bg-neutral-900 text-white"
                    : "flex h-8 w-8 items-center justify-center border border-neutral-300 text-neutral-600 hover:border-neutral-900"
                }
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
