import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { NavItem } from "@/config/navigation";

export default function MegaMenu({ item }: { item: NavItem }) {
  if (!item.megaMenu) return null;

  return (
    <div
      className="absolute left-0 top-full z-40 w-full border-t border-neutral-200 bg-white opacity-0 shadow-lg transition-all duration-200 ease-out invisible translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0"
    >
      <div className="container-nova grid grid-cols-4 gap-8 py-8">
        <div className="col-span-3 grid grid-cols-3 gap-8">
          {item.megaMenu.columns.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {column.heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-700 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {item.megaMenu.image && (
          <Link
            href={item.megaMenu.image.href}
            className="relative col-span-1 block aspect-[4/5] overflow-hidden bg-neutral-100"
          >
            <ImageWithFallback
              src={item.megaMenu.image.src}
              alt={item.megaMenu.image.alt}
              fill
              sizes="20vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            <span className="absolute bottom-3 left-3 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-900">
              Shop {item.label}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
