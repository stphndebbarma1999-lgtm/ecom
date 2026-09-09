"use client";

import { ShoppingBag } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, subtotal } = useCart();

  return (
    <Drawer open={isDrawerOpen} onClose={closeDrawer} title={`Your Cart (${items.length})`}>
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <ShoppingBag size={32} className="text-neutral-300" />
          <p className="text-sm font-medium text-neutral-900">Your cart is empty</p>
          <Button variant="primary" size="sm" href="/new-arrivals" onClick={closeDrawer}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-5">
            {items.map((item) => (
              <CartItem key={`${item.productId}-${item.color}-${item.size}`} item={item} />
            ))}
          </div>
          <div className="border-t border-neutral-200 p-5">
            <CartSummary subtotal={subtotal} />
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="primary" size="lg" className="w-full" href="/checkout" onClick={closeDrawer}>
                Proceed to Checkout
              </Button>
              <Button variant="outline" size="lg" className="w-full" href="/cart" onClick={closeDrawer}>
                View Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
