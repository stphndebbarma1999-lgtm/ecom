"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 5000;

export default function HeroSlider({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [images.length, paused]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200">
        <ImageWithFallback src="" alt={alt} fill className="object-contain" />
      </div>
    );
  }

  return (
    <div
      className="group relative w-full overflow-hidden bg-neutral-200"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Sized off the first slide so the box matches the photos' real proportions;
          later slides layer on top via absolute positioning and crossfade in. */}
      <ImageWithFallback
        src={images[0]}
        alt={alt}
        width={1200}
        height={1000}
        priority
        sizes="(max-width: 1024px) 90vw, 45vw"
        className="invisible h-auto w-full object-contain"
      />

      {images.map((src, i) => (
        <div
          key={src + i}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <ImageWithFallback
            src={src}
            alt={`${alt} ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-contain"
          />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 max-lg:opacity-100"
          >
            <ChevronLeft size={18} className="text-neutral-900" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 max-lg:opacity-100"
          >
            <ChevronRight size={18} className="text-neutral-900" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-2 py-1.5 backdrop-blur-sm">
            {images.map((src, i) => (
              <button
                key={src + i}
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
