import Link from "next/link";
import { getHomepageContent } from "@/lib/db/homepage";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default async function CategorySection() {
  const { featuredCategories } = await getHomepageContent();

  return (
    <section className="border-b border-neutral-100 py-10 lg:py-14">
      <div className="container-nova">
        <h2 className="text-2xl font-bold uppercase tracking-wide text-neutral-900 sm:text-3xl">
          Shop by Categories
        </h2>

        <div className="mt-6 grid grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
          {featuredCategories.map((category) => (
            <Link key={category.name} href={category.href} className="group flex flex-col">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 33vw, 20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-neutral-900 sm:text-sm">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
