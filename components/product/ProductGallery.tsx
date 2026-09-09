"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { cn } from "@/lib/utils";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const gallery = images.length > 0 ? images : [""];
  const [active, setActive] = useState(0);

  const goTo = (index: number) => {
    setActive((index + gallery.length) % gallery.length);
  };

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto lg:w-20 lg:flex-col lg:overflow-visible">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-[3/4] w-16 shrink-0 overflow-hidden border bg-neutral-100 lg:w-full",
                i === active ? "border-neutral-900" : "border-transparent"
              )}
            >
              <ImageWithFallback src={img} alt={`${name} thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
          <ImageWithFallback
            src={gallery[active]}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 lg:hidden">
              {gallery.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === active ? "w-4 bg-neutral-900" : "w-1.5 bg-neutral-300"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
