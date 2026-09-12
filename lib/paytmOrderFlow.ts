import "server-only";
import { getTransactionStatus } from "@/lib/paytm";
import { createOrder, getOrderByPaytmOrderId } from "@/lib/db/orders";
import { getPendingOrder, deletePendingOrder } from "@/lib/db/pendingOrders";

export type FinalizeResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

/**
 * Confirms a Paytm payment and creates the real order from the stashed
 * pending-order payload. Shared by the client-driven status check (fired
 * when CheckoutJS's lightbox closes) and Paytm's own server callback
 * (the fallback for payment methods that leave the page) — either one may
 * reach here first, so this is idempotent on paytm_order_id.
 */
export async function finalizePaytmOrder(paytmOrderId: string): Promise<FinalizeResult> {
  const existing = await getOrderByPaytmOrderId(paytmOrderId);
  if (existing) {
    return { ok: true, orderNumber: existing.orderNumber };
  }

  const pending = await getPendingOrder(paytmOrderId);
  if (!pending) {
    return { ok: false, error: "No pending order found for this payment." };
  }

  let status;
  try {
    status = await getTransactionStatus(paytmOrderId);
  } catch (err) {
    console.error("Failed to fetch Paytm transaction status:", err);
    return { ok: false, error: "Could not confirm payment status. Please try again." };
  }

  if (status.status !== "TXN_SUCCESS") {
    return {
      ok: false,
      error: "Payment was not successful. Please try again or choose a different method.",
    };
  }

  try {
    const created = await createOrder({
      ...pending,
      paymentStatus: "paid",
      paytmOrderId,
      paytmTxnId: status.txnId,
    });
    await deletePendingOrder(paytmOrderId);
    return { ok: true, orderNumber: created.orderNumber };
  } catch (err) {
    console.error("Payment confirmed but failed to create order:", err);
    return {
      ok: false,
      error:
        "Your payment succeeded but we couldn't save the order. Please contact support with your order reference: " +
        paytmOrderId,
    };
  }
}
