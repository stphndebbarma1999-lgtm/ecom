"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function MobileNavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Drawer open={open} onClose={onClose} title={siteConfig.logo.text} side="left">
      <nav className="flex flex-col px-2 py-2">
        {mainNav.map((item) => {
          if (!item.megaMenu) {
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="border-b border-neutral-100 px-3 py-3.5 text-sm font-medium text-neutral-900"
              >
                {item.label}
              </Link>
            );
          }

          const isOpen = expanded === item.label;
          return (
            <div key={item.href} className="border-b border-neutral-100">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : item.label)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-3 py-3.5 text-left text-sm font-medium text-neutral-900"
              >
                <Link href={item.href} onClick={onClose} className="flex-1">
                  {item.label}
                </Link>
                <ChevronDown
                  size={16}
                  className={cn("transition-transform", isOpen && "rotate-180")}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setExpanded(isOpen ? null : item.label);
                  }}
                />
              </button>
              {isOpen && (
                <div className="flex flex-col gap-4 bg-neutral-50 px-5 pb-4">
                  {item.megaMenu.columns.map((column) => (
                    <div key={column.heading}>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        {column.heading}
                      </p>
                      <div className="flex flex-col gap-2">
                        {column.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="text-sm text-neutral-600"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </Drawer>
  );
}
