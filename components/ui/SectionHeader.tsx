import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  title,
  viewAllHref,
  viewAllLabel = "View All",
}: {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
        {title}
      </h2>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group flex shrink-0 items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          {viewAllLabel}
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
