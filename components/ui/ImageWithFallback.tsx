"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src?: string;
};

/**
 * Wraps next/image so every product/category/banner image can safely be an
 * empty string or a broken Sirv URL without breaking layout. Renders a
 * neutral placeholder that preserves the same box the real image would take.
 */
export default function ImageWithFallback({ src, alt, className, fill, ...rest }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt || "Image placeholder"}
        className={cn(
          "flex items-center justify-center bg-neutral-100 text-neutral-300",
          fill ? "absolute inset-0 h-full w-full" : "h-full w-full",
          className
        )}
      >
        <ImageOff className="h-6 w-6" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
