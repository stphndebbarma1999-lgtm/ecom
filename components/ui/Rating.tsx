import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Rating({
  value,
  reviewCount,
  size = "sm",
  className,
}: {
  value: number;
  reviewCount?: number;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const iconSize = size === "xs" ? 12 : size === "sm" ? 14 : 16;
  const textSize = size === "xs" ? "text-[11px]" : size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        <Star size={iconSize} className="fill-amber-400 text-amber-400" />
      </div>
      <span className={cn("font-medium text-neutral-900", textSize)}>
        {value.toFixed(1)}
      </span>
      {typeof reviewCount === "number" && (
        <span className={cn("text-neutral-500", textSize)}>({reviewCount})</span>
      )}
    </div>
  );
}
