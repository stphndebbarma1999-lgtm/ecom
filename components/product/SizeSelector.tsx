"use client";

import { cn } from "@/lib/utils";

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
}: {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
}) {
  if (sizes.length === 0 || sizes[0] === "One Size") return null;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-900">Size</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
        {sizes.map((size) => {
          const isSelected = size === selected;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(size)}
              className={cn(
                "flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-medium transition-colors",
                isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-700 hover:border-neutral-900"
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
