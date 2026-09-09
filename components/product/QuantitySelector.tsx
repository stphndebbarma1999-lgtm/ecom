"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({
  quantity,
  onChange,
  max = 10,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
}) {
  return (
    <div className="flex items-center border border-neutral-300">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="flex h-11 w-10 items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
      >
        <Minus size={14} />
      </button>
      <span className="flex h-11 w-10 items-center justify-center text-sm font-medium">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="flex h-11 w-10 items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
