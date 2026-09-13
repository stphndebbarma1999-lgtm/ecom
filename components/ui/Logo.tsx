import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * The brand logo image (public/logo.png). Rendered on a white background —
 * the artwork itself has a white canvas, so it isn't used on dark surfaces
 * (footer, admin sidebar), which keep the plain text wordmark instead.
 */
export default function Logo({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt={siteConfig.name}
      width={1536}
      height={1024}
      priority={priority}
      className={className}
    />
  );
}
