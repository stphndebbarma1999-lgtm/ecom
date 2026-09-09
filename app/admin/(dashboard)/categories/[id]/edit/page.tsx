import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/db/categories";
import CategoryForm from "@/components/admin/CategoryForm";
import { updateCategoryAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  const boundAction = updateCategoryAction.bind(null, category.id!, category.department, category.slug);

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Category</h1>
      <div className="mt-6">
        <CategoryForm action={boundAction} category={category} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
