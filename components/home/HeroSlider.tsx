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

  return (
    <div
      className="group relative h-full w-full overflow-hidden bg-neutral-200"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.length === 0 ? (
        <ImageWithFallback src="" alt={alt} fill className="object-cover" />
      ) : (
        images.map((src, i) => (
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
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))
      )}

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 max-lg:opacity-100 sm:left-5"
          >
            <ChevronLeft size={20} className="text-neutral-900" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 max-lg:opacity-100 sm:right-5"
          >
            <ChevronRight size={20} className="text-neutral-900" />
          </button>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-2 py-1.5 backdrop-blur-sm sm:bottom-8">
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
