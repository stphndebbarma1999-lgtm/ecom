import { NextResponse, type NextRequest } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { finalizeRazorpayOrder } from "@/lib/razorpayOrderFlow";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Called from the client once Razorpay's Checkout.js fires its success
 * handler. The signature it hands back is checked here — it can only have
 * been produced with the key secret, so this is the actual proof the
 * payment is genuine.
 */
export async function POST(request: NextRequest) {
  let body: {
    razorpayOrderId?: unknown;
    razorpayPaymentId?: unknown;
    razorpaySignature?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    !isNonEmptyString(body.razorpayOrderId) ||
    !isNonEmptyString(body.razorpayPaymentId) ||
    !isNonEmptyString(body.razorpaySignature)
  ) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }

  const isValidSignature = verifyPaymentSignature({
    razorpayOrderId: body.razorpayOrderId,
    razorpayPaymentId: body.razorpayPaymentId,
    razorpaySignature: body.razorpaySignature,
  });
  if (!isValidSignature) {
    console.error("Razorpay signature verification failed for order", body.razorpayOrderId);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 400 });
  }

  const result = await finalizeRazorpayOrder(body.razorpayOrderId, body.razorpayPaymentId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ orderNumber: result.orderNumber });
}
