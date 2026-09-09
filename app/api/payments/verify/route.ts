import { NextResponse, type NextRequest } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { createOrder } from "@/lib/db/orders";
import type { CreateOrderInput } from "@/types/order";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const razorpayOrderId = body.razorpay_order_id;
  const razorpayPaymentId = body.razorpay_payment_id;
  const razorpaySignature = body.razorpay_signature;

  if (
    !isNonEmptyString(razorpayOrderId) ||
    !isNonEmptyString(razorpayPaymentId) ||
    !isNonEmptyString(razorpaySignature)
  ) {
    return NextResponse.json({ error: "Missing payment verification fields." }, { status: 400 });
  }

  const isValid = verifyPaymentSignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) {
    return NextResponse.json(
      { error: "Payment verification failed. If you were charged, contact support." },
      { status: 400 }
    );
  }

  const order = body.order as Partial<CreateOrderInput> | undefined;
  if (!order || !order.shippingAddress || !Array.isArray(order.items) || order.items.length === 0) {
    return NextResponse.json({ error: "Missing order details." }, { status: 400 });
  }

  try {
    const created = await createOrder({
      customerName: String(order.customerName ?? ""),
      customerEmail: String(order.customerEmail ?? ""),
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      deliveryMethod: order.deliveryMethod ?? "standard",
      paymentMethod: order.paymentMethod ?? "card",
      paymentStatus: "paid",
      razorpayOrderId,
      razorpayPaymentId,
      subtotal: Number(order.subtotal ?? 0),
      discount: Number(order.discount ?? 0),
      shipping: Number(order.shipping ?? 0),
      total: Number(order.total ?? 0),
      items: order.items,
    });

    return NextResponse.json({ orderNumber: created.orderNumber });
  } catch (err) {
    console.error("Payment verified but failed to create order:", err);
    return NextResponse.json(
      {
        error:
          "Your payment succeeded but we couldn't save the order. Please contact support with your payment ID: " +
          razorpayPaymentId,
      },
      { status: 500 }
    );
  }
}
