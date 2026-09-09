"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface Section {
  title: string;
  content: string[];
}

function buildSections(product: Product): Section[] {
  return [
    {
      title: "Product Details",
      content: product.details?.length
        ? product.details
        : [
            product.description,
            `Category: ${product.category.replace(/-/g, " ")}`,
            `Brand: ${product.brand}`,
          ],
    },
    {
      title: "Material & Care",
      content: product.materialAndCare?.length
        ? product.materialAndCare
        : [
            "Refer to the product label for fabric composition and care instructions.",
            "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
          ],
    },
    {
      title: "Shipping",
      content: [
        "Free standard shipping on orders above ₹999.",
        "Orders are typically delivered within 3–7 business days.",
        "Express shipping available at checkout.",
      ],
    },
    {
      title: "Returns",
      content: [
        "30-day hassle-free returns on unused items with original tags.",
        "Refunds are processed within 5–7 business days of pickup.",
      ],
    },
  ];
}

export default function ProductAccordion({ product }: { product: Product }) {
  const sections = buildSections(product);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {sections.map((section, i) => {
        const isOpen = open === i;
        return (
          <div key={section.title}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-neutral-900"
            >
              {section.title}
              <ChevronDown
                size={18}
                className={cn("transition-transform", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && (
              <div className="flex flex-col gap-2 pb-4 text-sm leading-relaxed text-neutral-600">
                {section.content.map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
