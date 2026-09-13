import Link from "next/link";
import { Star } from "lucide-react";
import { getHomepageContent } from "@/lib/db/homepage";
import { siteConfig } from "@/config/site";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import HeroSlider from "@/components/home/HeroSlider";
import Button from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/utils";

export default async function Hero() {
  const { hero } = await getHomepageContent();

  return (
    <section className="overflow-x-clip border-b border-neutral-100 bg-neutral-50">
      <div className="container-nova grid grid-cols-1 items-center gap-10 py-10 lg:grid-cols-2 lg:gap-8 lg:py-16">
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            {hero.eyebrow}
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            {hero.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-md text-base text-neutral-600">{hero.subtitle}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={hero.primaryCta.href} variant="secondary" size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="outline" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-neutral-600">{hero.socialProof}</span>
          </div>
        </div>

        {/* Hero visual: on mobile this collapses to a single simple slider.
            Slides render at their own natural aspect ratio instead of being
            force-cropped into a fixed box, since admin-uploaded photos vary
            in shape (portrait lifestyle shots, landscape promo banners, etc). */}
        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
          <HeroSlider images={hero.images} alt={`${siteConfig.name} seasonal collection`} />

          {/* Floating product cards — desktop/tablet only */}
          {hero.floatingCards.map((card) => (
            <Link
              key={card.name}
              href="/new-arrivals"
              className={cn(
                "absolute hidden w-36 items-center gap-3 bg-white p-2.5 shadow-lg sm:flex",
                card.className
              )}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-neutral-100">
                <ImageWithFallback src={card.image} alt={card.name} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-neutral-900">{card.name}</p>
                <p className="text-xs text-neutral-500">{formatPrice(card.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
