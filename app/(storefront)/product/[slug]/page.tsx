import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/db/products";
import { siteConfig } from "@/config/site";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductAccordion from "@/components/product/ProductAccordion";
import ProductReviews from "@/components/product/ProductReviews";
import RecentlyViewedTracker from "@/components/product/RecentlyViewedTracker";
import RecentlyViewedSection from "@/components/product/RecentlyViewedSection";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductGrid from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | ${siteConfig.name}`,
    description: product.description,
  };
}

const departmentLabel: Record<string, string> = {
  men: "Men",
  women: "Women",
  beauty: "Beauty",
};

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="container-nova py-6 lg:py-10">
      <RecentlyViewedTracker productId={product.id} />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: departmentLabel[product.department], href: `/${product.department}` },
          {
            label: product.category
              .split("-")
              .map((w) => w[0].toUpperCase() + w.slice(1))
              .join(" "),
            href: `/${product.department}/${product.category}`,
          },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <div className="mt-4 lg:mt-10">
        <ProductAccordion product={product} />
      </div>

      <div className="border-b border-neutral-100">
        <h2 className="pt-8 text-xl font-semibold tracking-tight text-neutral-900">Reviews</h2>
        <ProductReviews product={product} />
      </div>

      {related.length > 0 && (
        <section className="py-10">
          <SectionHeader title="You May Also Like" />
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      <RecentlyViewedSection excludeId={product.id} />
    </div>
  );
}
