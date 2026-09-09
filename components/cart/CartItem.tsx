import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/types/cart";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import QuantitySelector from "@/components/product/QuantitySelector";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4">
      <Link
        href={`/product/${item.slug}`}
        className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-neutral-100"
      >
        <ImageWithFallback src={item.image} alt={item.name} fill className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs text-neutral-500">{item.brand}</span>
            <Link href={`/product/${item.slug}`} className="block text-sm font-medium text-neutral-900">
              {item.name}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.productId, item.color, item.size)}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 text-neutral-400 hover:text-accent"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-500">
          {item.color && <span>Color: {item.color}</span>}
          {item.size && <span>Size: {item.size}</span>}
        </div>

        <div className="mt-1 flex items-center justify-between">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(q) => updateQuantity(item.productId, q, item.color, item.size)}
          />
          <span className="text-sm font-semibold text-neutral-900">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
