import Link from "next/link";
import { getHomepageContent } from "@/lib/db/homepage";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

/** Full-width clickable banner shown just below "Shop by Categories". */
export default async function FeatureBanner() {
  const { midBanner } = await getHomepageContent();

  if (!midBanner.image) return null;

  return (
    <section className="py-10 lg:py-14">
      <div className="container-nova">
        <Link
          href={midBanner.href || "/"}
          className="group relative block aspect-[16/9] w-full overflow-hidden bg-neutral-200 sm:aspect-[21/9]"
        >
          <ImageWithFallback
            src={midBanner.image}
            alt="Featured collection"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>
    </section>
  );
}
