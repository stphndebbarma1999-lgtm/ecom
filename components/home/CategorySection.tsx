import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHomepageContent } from "@/lib/db/homepage";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import SectionHeader from "@/components/ui/SectionHeader";

export default async function CategorySection() {
  const { featuredCategories } = await getHomepageContent();

  return (
    <section className="border-b border-neutral-100 py-10 lg:py-14">
      <div className="container-nova">
        <SectionHeader title="Shop by Categories" />

        {/* Mobile: swipeable horizontal carousel. Desktop: grid row. */}
        <div className="mt-6 flex gap-4 overflow-x-auto no-scrollbar sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible lg:grid-cols-8">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative flex w-28 shrink-0 flex-col overflow-hidden sm:w-auto"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 30vw, 12vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-1">
                <span className="text-sm font-medium text-neutral-900">{category.name}</span>
                <ArrowRight
                  size={14}
                  className="shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-900"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
