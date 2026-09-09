"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, ShoppingBag, User } from "lucide-react";
import { mobileBottomNav } from "@/config/navigation";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const iconMap = {
  home: Home,
  compass: Compass,
  heart: Heart,
  "shopping-bag": ShoppingBag,
  user: User,
};

const HIDDEN_PREFIXES = ["/product/", "/checkout"];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white lg:hidden">
      <div className="grid grid-cols-5">
        {mobileBottomNav.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                isActive ? "text-neutral-900" : "text-neutral-400"
              )}
            >
              <span className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                {item.href === "/cart" && itemCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-white">
                    {itemCount}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
