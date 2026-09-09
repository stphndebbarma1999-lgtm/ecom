import { listAllCategories } from "@/lib/db/categories";
import ProductForm from "@/components/admin/ProductForm";
import { createProductAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await listAllCategories();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-neutral-900">Add Product</h1>
      <div className="mt-6">
        <ProductForm action={createProductAction} categories={categories} submitLabel="Create Product" />
      </div>
    </div>
  );
}
