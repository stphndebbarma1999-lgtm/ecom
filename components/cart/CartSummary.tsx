import { formatPrice } from "@/lib/utils";

export default function CartSummary({
  subtotal,
  discount = 0,
  shipping,
}: {
  subtotal: number;
  discount?: number;
  shipping?: number;
}) {
  const computedShipping = shipping ?? (subtotal >= 999 || subtotal === 0 ? 0 : 59);
  const total = subtotal - discount + computedShipping;

  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex items-center justify-between text-neutral-600">
        <span>Subtotal</span>
        <span className="text-neutral-900">{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex items-center justify-between text-neutral-600">
          <span>Discount</span>
          <span className="text-emerald-600">-{formatPrice(discount)}</span>
        </div>
      )}
      <div className="flex items-center justify-between text-neutral-600">
        <span>Shipping</span>
        <span className="text-neutral-900">
          {computedShipping === 0 ? "Free" : formatPrice(computedShipping)}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-base font-semibold text-neutral-900">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
