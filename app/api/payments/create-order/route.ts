import { NextResponse, type NextRequest } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { getProductById } from "@/lib/db/products";
import type { DeliveryMethod } from "@/types/order";

interface RequestItem {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

/**
 * Computes the charge amount server-side from current product prices rather
 * than trusting a client-supplied total — the only way to stop a tampered
 * request from paying less than the real price.
 */
export async function POST(request: NextRequest) {
  let body: { items?: RequestItem[]; deliveryMethod?: DeliveryMethod };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const items = body.items ?? [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const deliveryMethod: DeliveryMethod = body.deliveryMethod === "express" ? "express" : "standard";

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

  const shipping = deliveryMethod === "express" ? 149 : subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `nova_${Date.now()}`,
    });

    return NextResponse.json({
      razorpayOrderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      subtotal,
      shipping,
      total,
      items: resolvedItems,
    });
  } catch (err) {
    console.error("Failed to create Razorpay order:", err);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }
}
