"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductColor } from "@/types/product";

export default function ColorSelector({
  colors,
  selected,
  onSelect,
}: {
  colors: ProductColor[];
  selected: string;
  onSelect: (name: string) => void;
}) {
  if (colors.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-900">
        Color: <span className="font-normal text-neutral-600">{selected}</span>
      </p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
        {colors.map((color) => {
          const isSelected = color.name === selected;
          const isLight = ["#FFFFFF", "#D8C3A5", "#F4C2C2"].includes(
            color.hex.toUpperCase()
          );
          return (
            <button
              key={color.name}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={color.name}
              onClick={() => onSelect(color.name)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border transition-all",
                isSelected
                  ? "border-neutral-900 ring-1 ring-neutral-900 ring-offset-2"
                  : "border-neutral-200"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  isLight && "border border-neutral-300"
                )}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <Check
                    size={14}
                    className={isLight ? "text-neutral-900" : "text-white"}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
