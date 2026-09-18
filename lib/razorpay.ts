import "server-only";
import crypto from "crypto";

function getConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variables. Copy .env.local.example to .env.local and fill in real values."
    );
  }

  return { keyId, keySecret };
}

function authHeader(keyId: string, keySecret: string): string {
  return "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
}

/** Client-visible config needed to load Razorpay's Checkout.js and open the payment modal. */
export function getRazorpayClientConfig() {
  const { keyId } = getConfig();
  return { keyId, checkoutJsUrl: "https://checkout.razorpay.com/v1/checkout.js" };
}

interface CreateRazorpayOrderResult {
  razorpayOrderId: string;
  amount: number; // paise
  currency: string;
}

/**
 * Creates a Razorpay Order via the Orders API, signed with Basic Auth using
 * the key secret (never exposed to the client). `payment_capture: 1` means
 * Razorpay auto-captures on success rather than leaving it authorized-only.
 */
export async function createRazorpayOrder({
  amount,
  receipt,
}: {
  amount: number; // rupees
  receipt: string;
}): Promise<CreateRazorpayOrderResult> {
  const { keyId, keySecret } = getConfig();
  const amountPaise = Math.round(amount * 100);

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(keyId, keySecret),
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt,
      payment_capture: 1,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data?.id) {
    console.error("Razorpay order creation failed:", JSON.stringify(data, null, 2));
    throw new Error(data?.error?.description || "Failed to create Razorpay order.");
  }

  return { razorpayOrderId: data.id, amount: data.amount, currency: data.currency };
}

/**
 * Verifies the HMAC signature Checkout.js's success handler returns to the
 * browser — the cryptographic proof a payment is genuine, since it can only
 * be produced with the key secret Razorpay and this server share.
 */
export function verifyPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const { keySecret } = getConfig();
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(razorpaySignature || "", "utf8");
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

export interface RazorpayPaymentStatus {
  status: "captured" | "failed" | "other";
  amount?: number; // paise
  orderId?: string;
}

/**
 * Authoritative payment confirmation: asks Razorpay directly for the
 * current state of a payment rather than trusting anything the browser
 * reports, even though the signature already proves it wasn't forged.
 */
export async function getPaymentStatus(razorpayPaymentId: string): Promise<RazorpayPaymentStatus> {
  const { keyId, keySecret } = getConfig();

  const res = await fetch(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
    headers: { Authorization: authHeader(keyId, keySecret) },
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Razorpay payment fetch failed:", JSON.stringify(data, null, 2));
    throw new Error(data?.error?.description || "Failed to fetch payment status.");
  }

  return {
    status: data.status === "captured" ? "captured" : data.status === "failed" ? "failed" : "other",
    amount: data.amount,
    orderId: data.order_id,
  };
}

/**
 * Verifies the signature Razorpay attaches to webhook POSTs — signed with
 * the separate webhook secret configured in the dashboard, over the raw
 * request body (must be the untouched bytes, not a re-serialized object).
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !signature) return false;

  const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(signature, "utf8");
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
