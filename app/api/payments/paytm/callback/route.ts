import { NextResponse, type NextRequest } from "next/server";
import { verifyCallbackChecksum } from "@/lib/paytm";
import { finalizePaytmOrder } from "@/lib/paytmOrderFlow";

/**
 * Paytm posts here server-to-server (form-encoded) after payment for any
 * flow that leaves the page (e.g. net banking redirecting to the bank and
 * back). Most card/UPI/wallet payments never need this — they resolve
 * inside the CheckoutJS lightbox and the client calls /api/payments/verify
 * directly — but Paytm requires a valid callbackUrl regardless, and this is
 * the safety net for whichever payment methods do redirect.
 */
export async function POST(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  let params: Record<string, string>;
  try {
    const formData = await request.formData();
    params = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
    );
  } catch {
    return NextResponse.redirect(`${appUrl}/checkout?payment=error`, 303);
  }

  const orderId = params.ORDERID;
  if (!orderId) {
    return NextResponse.redirect(`${appUrl}/checkout?payment=error`, 303);
  }

  const isValidSignature = verifyCallbackChecksum(params);
  if (!isValidSignature) {
    console.error("Paytm callback failed checksum verification for order", orderId);
    return NextResponse.redirect(`${appUrl}/checkout?payment=error`, 303);
  }

  if (params.STATUS !== "TXN_SUCCESS") {
    return NextResponse.redirect(`${appUrl}/checkout?payment=failed`, 303);
  }

  const result = await finalizePaytmOrder(orderId);
  if (!result.ok) {
    console.error("Paytm callback: failed to finalize order", orderId, result.error);
    return NextResponse.redirect(`${appUrl}/checkout?payment=error`, 303);
  }

  return NextResponse.redirect(
    `${appUrl}/checkout?payment=success&order=${encodeURIComponent(result.orderNumber)}`,
    303
  );
}
