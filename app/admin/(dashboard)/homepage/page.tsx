import { getHomepageContent } from "@/lib/db/homepage";
import HomepageForm from "@/components/admin/HomepageForm";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const content = await getHomepageContent();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-neutral-900">Homepage</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Edit the hero section, promo banners and category tiles shown on the storefront homepage.
      </p>
      <div className="mt-6">
        <HomepageForm content={content} />
      </div>
    </div>
  );
}
