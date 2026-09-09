"use client";

import { ShoppingBag } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, subtotal } = useCart();

  return (
    <div className="container-nova py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <ShoppingBag size={32} className="text-neutral-300" />
          <p className="text-sm font-medium text-neutral-900">Your cart is empty</p>
          <Button href="/new-arrivals" variant="primary" size="md" className="mt-2">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="divide-y divide-neutral-100 lg:col-span-2">
            {items.map((item) => (
              <CartItem key={`${item.productId}-${item.color}-${item.size}`} item={item} />
            ))}
          </div>

          <div className="flex flex-col gap-4 border border-neutral-200 p-5 lg:sticky lg:top-24 lg:h-fit">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
              Order Summary
            </h2>
            <CartSummary subtotal={subtotal} />
            <Button href="/checkout" variant="primary" size="lg" className="w-full">
              Proceed to Checkout
            </Button>
            <Button href="/new-arrivals" variant="outline" size="lg" className="w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
