"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, User, ShoppingBag } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearchOverlay } from "@/context/SearchContext";
import MegaMenu from "@/components/layout/MegaMenu";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const { items: wishlistItems } = useWishlist();
  const search = useSearchOverlay();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 hidden bg-white transition-shadow duration-200 lg:block",
        scrolled ? "border-b border-neutral-200 shadow-sm" : "border-b border-transparent"
      )}
    >
      <div className="container-nova flex h-20 items-center justify-between gap-8">
        <Link href="/" className="shrink-0 text-2xl font-bold tracking-tight text-neutral-900">
          {siteConfig.logo.text}
        </Link>

        <nav className="flex items-center gap-8">
          {mainNav.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="flex h-20 items-center text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900"
              >
                {item.label}
              </Link>
              {item.megaMenu && <MegaMenu item={item} />}
            </div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-5">
          <button
            type="button"
            onClick={search.open}
            aria-label="Search"
            className="text-neutral-700 transition-colors hover:text-neutral-900"
          >
            <Search size={20} />
          </button>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative text-neutral-700 transition-colors hover:text-neutral-900"
          >
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="text-neutral-700 transition-colors hover:text-neutral-900"
          >
            <User size={20} />
          </Link>
          <button
            type="button"
            onClick={openDrawer}
            aria-label="Cart"
            className="relative text-neutral-700 transition-colors hover:text-neutral-900"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
