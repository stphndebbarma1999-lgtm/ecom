import "server-only";
import { getPaymentStatus } from "@/lib/razorpay";
import { createOrder, getOrderByRazorpayOrderId } from "@/lib/db/orders";
import { getPendingOrder, deletePendingOrder } from "@/lib/db/pendingOrders";

export type FinalizeResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

/**
 * Confirms a Razorpay payment and creates the real order from the stashed
 * pending-order payload. Shared by the client-driven verify call (fired
 * from Checkout.js's success handler, after the route checks its signature)
 * and Razorpay's webhook (the fallback for a handler that never fires, e.g.
 * the browser closing mid-redirect) — either one may reach here first, so
 * this is idempotent on razorpay_order_id.
 */
export async function finalizeRazorpayOrder(
  razorpayOrderId: string,
  razorpayPaymentId: string
): Promise<FinalizeResult> {
  const existing = await getOrderByRazorpayOrderId(razorpayOrderId);
  if (existing) {
    return { ok: true, orderNumber: existing.orderNumber };
  }

  const pending = await getPendingOrder(razorpayOrderId);
  if (!pending) {
    return { ok: false, error: "No pending order found for this payment." };
  }

  let status;
  try {
    status = await getPaymentStatus(razorpayPaymentId);
  } catch (err) {
    console.error("Failed to fetch Razorpay payment status:", err);
    return { ok: false, error: "Could not confirm payment status. Please try again." };
  }

  if (status.status !== "captured" || status.orderId !== razorpayOrderId) {
    return {
      ok: false,
      error: "Payment was not successful. Please try again or choose a different method.",
    };
  }

  try {
    const created = await createOrder({
      ...pending,
      paymentStatus: "paid",
      razorpayOrderId,
      razorpayPaymentId,
    });
    await deletePendingOrder(razorpayOrderId);
    return { ok: true, orderNumber: created.orderNumber };
  } catch (err) {
    console.error("Payment confirmed but failed to create order:", err);
    return {
      ok: false,
      error:
        "Your payment succeeded but we couldn't save the order. Please contact support with your order reference: " +
        razorpayOrderId,
    };
  }
}
