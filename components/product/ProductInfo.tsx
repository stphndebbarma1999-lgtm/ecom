"use client";

import { useState } from "react";
import { Heart, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import type { Product } from "@/types/product";
import Rating from "@/components/ui/Rating";
import Button from "@/components/ui/Button";
import ColorSelector from "@/components/product/ColorSelector";
import SizeSelector from "@/components/product/SizeSelector";
import QuantitySelector from "@/components/product/QuantitySelector";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

export default function ProductInfo({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const { addItem, openDrawer } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const router = useRouter();

  const inWishlist = isInWishlist(product.id);
  const lineItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    image: product.images[0] ?? "",
    price: product.price,
    originalPrice: product.originalPrice,
    color,
    size,
    quantity,
  };

  const handleAddToCart = () => {
    addItem(lineItem);
    openDrawer();
  };

  const handleBuyNow = () => {
    addItem(lineItem);
    router.push("/checkout");
  };

  const handleWishlist = () => {
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

  return (
    <div className="flex flex-col pb-28 lg:pb-0">
      <span className="text-sm font-medium text-neutral-500">{product.brand}</span>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        {product.name}
      </h1>

      <div className="mt-2">
        <Rating value={product.rating} reviewCount={product.reviewCount} size="md" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-2xl font-semibold text-accent">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-base text-neutral-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            {product.discountPercentage && (
              <span className="text-sm font-semibold text-emerald-600">
                {product.discountPercentage}% OFF
              </span>
            )}
          </>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-neutral-600">
        {product.description}
      </p>

      <div className="mt-6 flex flex-col gap-6">
        <ColorSelector colors={product.colors} selected={color} onSelect={setColor} />
        <SizeSelector sizes={product.sizes} selected={size} onSelect={setSize} />

        <div>
          <p className="mb-2 text-sm font-medium text-neutral-900">Quantity</p>
          <div className="flex items-center gap-4">
            <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
            <span
              className={cn(
                "text-xs font-medium",
                product.stock > 5 ? "text-emerald-600" : "text-accent"
              )}
            >
              {product.stock > 5 ? "In Stock" : `Only ${product.stock} left`}
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-neutral-200 bg-white p-4",
          "lg:static lg:z-auto lg:mt-8 lg:border-0 lg:bg-transparent lg:p-0"
        )}
      >
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          className="hidden h-12 w-12 shrink-0 items-center justify-center border border-neutral-300 text-neutral-700 hover:border-neutral-900 lg:flex"
        >
          <Heart size={18} className={inWishlist ? "fill-accent text-accent" : ""} />
        </button>
        <Button variant="outline" size="lg" className="flex-1" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={handleBuyNow}>
          Buy Now
        </Button>
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          className="flex h-12 w-12 shrink-0 items-center justify-center border border-neutral-300 text-neutral-700 hover:border-neutral-900 lg:hidden"
        >
          <Heart size={18} className={inWishlist ? "fill-accent text-accent" : ""} />
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 border-t border-neutral-200 pt-6 sm:grid-cols-3">
        <div className="flex items-start gap-2 text-xs text-neutral-600">
          <Truck size={16} className="mt-0.5 shrink-0" />
          Free shipping over ₹999
        </div>
        <div className="flex items-start gap-2 text-xs text-neutral-600">
          <RotateCcw size={16} className="mt-0.5 shrink-0" />
          30-day easy returns
        </div>
        <div className="flex items-start gap-2 text-xs text-neutral-600">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          100% secure checkout
        </div>
      </div>
    </div>
  );
}
