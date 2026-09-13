"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, ChevronLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearchOverlay } from "@/context/SearchContext";
import MobileNavDrawer from "@/components/layout/MobileNavDrawer";
import Logo from "@/components/ui/Logo";

export default function MobileHeader() {
  const [navOpen, setNavOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const { items: wishlistItems } = useWishlist();
  const search = useSearchOverlay();
  const pathname = usePathname();
  const router = useRouter();

  const isProductDetail = pathname.startsWith("/product/");

  if (isProductDetail) {
    return (
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center text-neutral-900"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="text-sm font-semibold text-neutral-900">Product Detail</span>
          <button
            type="button"
            onClick={openDrawer}
            aria-label="Cart"
            className="relative flex h-9 w-9 items-center justify-center text-neutral-900"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute right-0 top-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
            className="text-neutral-900"
          >
            <Menu size={22} />
          </button>

          <Link href="/">
            <Logo className="h-12 w-auto" priority />
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={search.open}
              aria-label="Search"
              className="text-neutral-900"
            >
              <Search size={20} />
            </button>
            <Link href="/wishlist" aria-label="Wishlist" className="relative text-neutral-900">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={openDrawer}
              aria-label="Cart"
              className="relative text-neutral-900"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileNavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
    </>
  );
}
