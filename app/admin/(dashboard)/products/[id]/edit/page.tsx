import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db/products";
import { listAllCategories } from "@/lib/db/categories";
import ProductForm from "@/components/admin/ProductForm";
import { updateProductAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), listAllCategories()]);
  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, product.id, product.slug);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Product</h1>
      <div className="mt-6">
        <ProductForm
          action={boundAction}
          categories={categories}
          product={product}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
