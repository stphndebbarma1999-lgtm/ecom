"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import Badge from "@/components/ui/Badge";
import Rating from "@/components/ui/Rating";
import { cn, formatPrice } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { isInWishlist, toggleItem } = useWishlist();
  const { addItem } = useCart();
  const inWishlist = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0] ?? "",
      price: product.price,
      originalPrice: product.originalPrice,
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0] ?? "",
      price: product.price,
      originalPrice: product.originalPrice,
      color: product.colors[0]?.name,
      size: product.sizes[0],
      quantity: 1,
    });
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn("group flex flex-col", className)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.isNew && <Badge variant="dark">New</Badge>}
          {product.discountPercentage && (
            <Badge variant="accent">-{product.discountPercentage}%</Badge>
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm transition-colors hover:text-accent"
        >
          <Heart
            size={16}
            className={inWishlist ? "fill-accent text-accent" : ""}
          />
        </button>

        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.name} to cart`}
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 sm:flex"
        >
          <ShoppingBag size={15} />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-neutral-500">{product.brand}</span>
          <Rating value={product.rating} reviewCount={product.reviewCount} size="xs" />
        </div>
        <h3 className="line-clamp-1 text-sm font-medium text-neutral-900">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
