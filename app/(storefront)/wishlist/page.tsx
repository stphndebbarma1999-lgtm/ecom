"use client";

import Link from "next/link";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem, openDrawer } = useCart();

  const moveToCart = (item: (typeof items)[number]) => {
    addItem({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: 1,
    });
    removeItem(item.productId);
    openDrawer();
  };

  return (
    <div className="container-nova py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Wishlist
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <Heart size={32} className="text-neutral-300" />
          <p className="text-sm font-medium text-neutral-900">Your wishlist is empty</p>
          <p className="text-sm text-neutral-500">Save items you love for later.</p>
          <Button href="/new-arrivals" variant="primary" size="md" className="mt-2">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-col">
              <Link
                href={`/product/${item.slug}`}
                className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100"
              >
                <ImageWithFallback src={item.image} alt={item.name} fill className="object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeItem(item.productId);
                  }}
                  aria-label={`Remove ${item.name} from wishlist`}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 hover:text-accent"
                >
                  <Trash2 size={15} />
                </button>
              </Link>
              <div className="mt-3 flex flex-col gap-1">
                <span className="text-xs font-medium text-neutral-500">{item.brand}</span>
                <Link href={`/product/${item.slug}`} className="line-clamp-1 text-sm font-medium text-neutral-900">
                  {item.name}
                </Link>
                <span className="text-sm font-semibold text-neutral-900">
                  {formatPrice(item.price)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => moveToCart(item)}
                className="mt-3 flex items-center justify-center gap-2 border border-neutral-300 py-2.5 text-xs font-medium text-neutral-900 hover:border-neutral-900"
              >
                <ShoppingBag size={14} />
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
