import CategoryForm from "@/components/admin/CategoryForm";
import { createCategoryAction } from "../actions";

export default function NewCategoryPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-neutral-900">Add Category</h1>
      <div className="mt-6">
        <CategoryForm action={createCategoryAction} submitLabel="Create Category" />
      </div>
    </div>
  );
}
