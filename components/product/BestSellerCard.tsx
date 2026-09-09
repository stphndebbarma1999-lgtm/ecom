"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import Badge from "@/components/ui/Badge";
import Rating from "@/components/ui/Rating";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function BestSellerCard({ product }: { product: Product }) {
  const { addItem, openDrawer } = useCart();

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
      color: product.colors[0]?.name,
      size: product.sizes[0],
      quantity: 1,
    });
    openDrawer();
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex gap-4 border border-neutral-200 p-4 transition-colors hover:border-neutral-900"
    >
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden bg-neutral-100 sm:w-28">
        <ImageWithFallback src={product.images[0]} alt={product.name} fill className="object-cover" />
        <Badge variant="accent" className="absolute left-1.5 top-1.5">
          Bestseller
        </Badge>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-medium text-neutral-500">{product.brand}</span>
        <h3 className="mt-0.5 line-clamp-1 text-sm font-semibold text-neutral-900">
          {product.name}
        </h3>
        <span className="mt-1 text-base font-semibold text-neutral-900">
          {formatPrice(product.price)}
        </span>
        <Rating value={product.rating} reviewCount={product.reviewCount} size="xs" className="mt-1" />
        <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-neutral-500">
          {product.description}
        </p>
        <button
          type="button"
          onClick={handleQuickAdd}
          className="mt-3 flex items-center justify-center gap-2 self-start bg-neutral-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
        >
          <ShoppingBag size={13} />
          Quick Add
        </button>
      </div>
    </Link>
  );
}
