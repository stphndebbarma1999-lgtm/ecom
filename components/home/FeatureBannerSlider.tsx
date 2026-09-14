"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { BannerSlide } from "@/types/homepage";
import { cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 5000;

export default function FeatureBannerSlider({ slides }: { slides: BannerSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [slides.length, paused]);

  return (
    <div
      className="group relative aspect-[16/9] w-full overflow-hidden bg-neutral-200 lg:aspect-[21/9]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <Link
          key={slide.desktop + slide.mobile + i}
          href={slide.href || "/"}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          {/* Mobile photo below lg, desktop photo at lg and up — each falls back to the other if only one was uploaded. */}
          <div className="absolute inset-0 lg:hidden">
            <ImageWithFallback
              src={slide.mobile || slide.desktop}
              alt={`Featured collection ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 hidden lg:block">
            <ImageWithFallback
              src={slide.desktop || slide.mobile}
              alt={`Featured collection ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 max-lg:opacity-100 sm:left-5"
          >
            <ChevronLeft size={20} className="text-neutral-900" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 max-lg:opacity-100 sm:right-5"
          >
            <ChevronRight size={20} className="text-neutral-900" />
          </button>

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
        </>
      )}
    </div>
  );
}
