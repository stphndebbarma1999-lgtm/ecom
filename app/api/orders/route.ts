import { NextResponse, type NextRequest } from "next/server";
import { createOrder } from "@/lib/db/orders";
import type { CreateOrderInput } from "@/types/order";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validate(body: unknown): body is CreateOrderInput {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.customerName) || !isNonEmptyString(b.customerEmail)) return false;
  if (!b.shippingAddress || typeof b.shippingAddress !== "object") return false;
  const addr = b.shippingAddress as Record<string, unknown>;
  if (
    !isNonEmptyString(addr.fullName) ||
    !isNonEmptyString(addr.phone) ||
    !isNonEmptyString(addr.address) ||
    !isNonEmptyString(addr.city) ||
    !isNonEmptyString(addr.state) ||
    !isNonEmptyString(addr.pinCode)
  ) {
    return false;
  }
  if (!Array.isArray(b.items) || b.items.length === 0) return false;
  for (const item of b.items) {
    if (!item || typeof item !== "object") return false;
    const i = item as Record<string, unknown>;
    if (!isNonEmptyString(i.productName) || typeof i.price !== "number" || typeof i.quantity !== "number") {
      return false;
    }
  }
  if (
    typeof b.subtotal !== "number" ||
    typeof b.discount !== "number" ||
    typeof b.shipping !== "number" ||
    typeof b.total !== "number"
  ) {
    return false;
  }

  return true;
}

/**
 * Cash-on-Delivery orders only. Any paid method (card/UPI/net banking) must
 * go through /api/payments/verify, which only creates the order after a
 * signature-verified Razorpay payment — so paymentMethod/paymentStatus are
 * forced here rather than trusted from the client, to stop a request from
 * claiming a card payment succeeded without actually paying.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!validate(body)) {
    return NextResponse.json({ error: "Missing or invalid order fields." }, { status: 400 });
  }

  try {
    const order = await createOrder({ ...body, paymentMethod: "cod", paymentStatus: "cod" });
    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (err) {
    console.error("Failed to create order:", err);
    return NextResponse.json({ error: "Could not place order. Please try again." }, { status: 500 });
  }
}
