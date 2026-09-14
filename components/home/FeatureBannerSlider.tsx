"use client";

import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { BannerSlide } from "@/types/homepage";
import { useSwipeCarousel } from "@/hooks/useSwipeCarousel";
import { cn } from "@/lib/utils";

export default function FeatureBannerSlider({ slides }: { slides: BannerSlide[] }) {
  const { index, setIndex, dragX, isDragging, handlers } = useSwipeCarousel(slides.length);

  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-200 lg:aspect-[21/9]"
      {...handlers}
      style={{ touchAction: "pan-y" }}
    >
      <div
        className="flex h-full w-full"
        style={{
          transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
          transition: isDragging ? "none" : "transform 500ms ease-in-out",
        }}
      >
        {slides.map((slide, i) => (
          <Link
            key={slide.desktop + slide.mobile + i}
            href={slide.href || "/"}
            className="relative h-full w-full shrink-0"
          >
            {/* Mobile photo below lg, desktop photo at lg and up — each falls back to the other if only one was uploaded. */}
            <div className="absolute inset-0 lg:hidden">
              <ImageWithFallback
                src={slide.mobile || slide.desktop}
                alt={`Featured collection ${i + 1}`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="pointer-events-none object-cover"
              />
            </div>
            <div className="absolute inset-0 hidden lg:block">
              <ImageWithFallback
                src={slide.desktop || slide.mobile}
                alt={`Featured collection ${i + 1}`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="pointer-events-none object-cover"
              />
            </div>
          </Link>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-2 py-1.5 backdrop-blur-sm sm:bottom-5">
          {slides.map((slide, i) => (
            <button
              key={slide.desktop + slide.mobile + i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
