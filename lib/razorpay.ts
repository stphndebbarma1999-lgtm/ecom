import "server-only";
import Razorpay from "razorpay";
import crypto from "node:crypto";

let cachedClient: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (cachedClient) return cachedClient;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variables. Copy .env.local.example to .env.local and fill in real values."
    );
  }

  cachedClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return cachedClient;
}

/**
 * Verifies a Razorpay Checkout payment per their documented algorithm:
 * HMAC-SHA256(order_id + "|" + payment_id, key_secret) must equal the
 * signature returned by Checkout. Never trust the client-side success
 * callback alone — this check is what actually confirms payment.
 */
export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const signatureBuffer = Buffer.from(signature, "hex");
  if (expectedBuffer.length !== signatureBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}
