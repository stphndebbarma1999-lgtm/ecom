import { NextResponse, type NextRequest } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { finalizeRazorpayOrder } from "@/lib/razorpayOrderFlow";

/**
 * Razorpay posts here server-to-server on payment events. This is the
 * safety net for cases where Checkout.js's success handler never runs in
 * the browser (tab closed mid-payment, network drop, etc.) — most payments
 * are already finalized by /api/payments/verify before this ever fires,
 * but finalizeRazorpayOrder is idempotent so either one landing first is
 * fine. Configure this URL in the Razorpay dashboard under Settings ->
 * Webhooks, subscribed to the "payment.captured" event.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("Razorpay webhook failed signature verification");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let payload: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string } } };
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (payload.event !== "payment.captured") {
    // Not an event we act on — acknowledge so Razorpay stops retrying it.
    return NextResponse.json({ ok: true });
  }

  const payment = payload.payload?.payment?.entity;
  if (!payment?.id || !payment?.order_id) {
    return NextResponse.json({ error: "Missing payment details in webhook payload." }, { status: 400 });
  }

  const result = await finalizeRazorpayOrder(payment.order_id, payment.id);
  if (!result.ok) {
    console.error("Razorpay webhook: failed to finalize order", payment.order_id, result.error);
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
