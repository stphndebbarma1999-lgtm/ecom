import { NextResponse, type NextRequest } from "next/server";
import { createRazorpayOrder, getRazorpayClientConfig } from "@/lib/razorpay";
import { getProductById } from "@/lib/db/products";
import { createPendingOrder } from "@/lib/db/pendingOrders";
import type { DeliveryMethod, OrderShippingAddress, PaymentMethod } from "@/types/order";

interface RequestItem {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface RequestBody {
  items?: RequestItem[];
  deliveryMethod?: DeliveryMethod;
  paymentMethod?: PaymentMethod;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: OrderShippingAddress;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Computes the charge amount server-side from current product prices rather
 * than trusting a client-supplied total — the only way to stop a tampered
 * request from paying less than the real price. The full order payload is
 * stashed (keyed by the Razorpay order id) so it can be recovered once
 * payment is confirmed — neither Checkout.js's handler nor the webhook ever
 * carries it back to us.
 */
export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const items = body.items ?? [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  if (!isNonEmptyString(body.customerName) || !isNonEmptyString(body.customerEmail)) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  const addr = body.shippingAddress;
  if (
    !addr ||
    !isNonEmptyString(addr.fullName) ||
    !isNonEmptyString(addr.phone) ||
    !isNonEmptyString(addr.address) ||
    !isNonEmptyString(addr.city) ||
    !isNonEmptyString(addr.state) ||
    !isNonEmptyString(addr.pinCode)
  ) {
    return NextResponse.json({ error: "A complete shipping address is required." }, { status: 400 });
  }

  const deliveryMethod: DeliveryMethod = body.deliveryMethod === "express" ? "express" : "standard";
  const paymentMethod: PaymentMethod = body.paymentMethod ?? "card";

  const resolvedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await getProductById(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: `A product in your cart is no longer available.` },
        { status: 400 }
      );
    }
    const quantity = Math.max(1, Math.floor(item.quantity));
    subtotal += product.price * quantity;
    resolvedItems.push({
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      image: product.images[0] ?? "",
      price: product.price,
      color: item.color,
      size: item.size,
      quantity,
    });
  }

  const shipping = deliveryMethod === "express" ? 149 : subtotal >= 999 ? 0 : 59;
  const total = subtotal + shipping;

  try {
    const receipt = `DRAPESLY${Date.now()}`;
    const { razorpayOrderId, amount, currency } = await createRazorpayOrder({
      amount: total,
      receipt,
    });

    await createPendingOrder(razorpayOrderId, {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      shippingAddress: addr,
      deliveryMethod,
      paymentMethod,
      subtotal,
      discount: 0,
      shipping,
      total,
      items: resolvedItems,
    });

    const { keyId, checkoutJsUrl } = getRazorpayClientConfig();

    return NextResponse.json({
      razorpayOrderId,
      amount,
      currency,
      keyId,
      checkoutJsUrl,
    });
  } catch (err) {
    console.error("Failed to create Razorpay order:", err);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }
}
