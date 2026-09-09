import { Star } from "lucide-react";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

const SAMPLE_REVIEWS = [
  {
    author: "Aisha K.",
    daysAgo: 6,
    comment: "Great fit and the fabric feels premium. Runs true to size.",
  },
  {
    author: "Rohan M.",
    daysAgo: 14,
    comment: "Exactly as pictured, fast delivery. Would buy again.",
  },
  {
    author: "Priya S.",
    daysAgo: 21,
    comment: "Good quality for the price. Color is slightly different in person but still nice.",
  },
];

function RatingBar({ stars, percent }: { stars: number; percent: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-neutral-600">
      <span className="w-3">{stars}</span>
      <Star size={12} className="fill-amber-400 text-amber-400" />
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full bg-amber-400" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-8 text-right">{percent}%</span>
    </div>
  );
}

export default function ProductReviews({ product }: { product: Product }) {
  const distribution = [
    { stars: 5, percent: 62 },
    { stars: 4, percent: 24 },
    { stars: 3, percent: 9 },
    { stars: 2, percent: 3 },
    { stars: 1, percent: 2 },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-3">
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold text-neutral-900">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-sm text-neutral-500">/ 5</span>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={cn(
                i < Math.round(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-neutral-200"
              )}
            />
          ))}
        </div>
        <p className="text-sm text-neutral-500">
          Based on {product.reviewCount} reviews
        </p>
        <div className="mt-2 flex w-full flex-col gap-1.5">
          {distribution.map((d) => (
            <RatingBar key={d.stars} stars={d.stars} percent={d.percent} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 md:col-span-2">
        {SAMPLE_REVIEWS.map((review) => (
          <div key={review.author} className="border-b border-neutral-100 pb-5 last:border-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-900">{review.author}</span>
              <span className="text-xs text-neutral-400">{review.daysAgo} days ago</span>
            </div>
            <div className="mt-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
