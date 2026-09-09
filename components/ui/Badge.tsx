import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "dark" | "accent" | "outline";

export default function Badge({
  children,
  variant = "dark",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const variantClasses: Record<Variant, string> = {
    dark: "bg-neutral-900 text-white",
    accent: "bg-accent text-white",
    outline: "border border-neutral-300 bg-white text-neutral-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
