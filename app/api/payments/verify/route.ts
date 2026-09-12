import { NextResponse, type NextRequest } from "next/server";
import { finalizePaytmOrder } from "@/lib/paytmOrderFlow";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Called from the client once Paytm's CheckoutJS lightbox closes. This is
 * just a prompt to check — the actual confirmation comes from Paytm's
 * Transaction Status API inside finalizePaytmOrder, never from anything
 * the browser claims about how the payment went.
 */
export async function POST(request: NextRequest) {
  let body: { paytmOrderId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isNonEmptyString(body.paytmOrderId)) {
    return NextResponse.json({ error: "Missing paytmOrderId." }, { status: 400 });
  }

  const result = await finalizePaytmOrder(body.paytmOrderId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ orderNumber: result.orderNumber });
}
