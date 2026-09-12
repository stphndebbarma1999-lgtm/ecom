import "server-only";
import PaytmChecksum from "paytmchecksum";

function getConfig() {
  const mid = process.env.PAYTM_MID;
  const merchantKey = process.env.PAYTM_MERCHANT_KEY;
  const website = process.env.PAYTM_WEBSITE || "WEBSTAGING";
  const environment = process.env.PAYTM_ENVIRONMENT === "production" ? "production" : "staging";

  if (!mid || !merchantKey) {
    throw new Error(
      "Missing PAYTM_MID or PAYTM_MERCHANT_KEY environment variables. Copy .env.local.example to .env.local and fill in real values."
    );
  }

  const baseUrl =
    environment === "production" ? "https://securegw.paytm.in" : "https://securegw-stage.paytm.in";

  return { mid, merchantKey, website, environment, baseUrl };
}

/** Client-visible config needed to load Paytm's CheckoutJS and open the payment lightbox. */
export function getPaytmClientConfig() {
  const { mid, baseUrl } = getConfig();
  return { mid, checkoutJsUrl: `${baseUrl}/merchantpgpui/checkoutjs/merchants/${mid}.js` };
}

function generateOrderId(): string {
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `DRAPESLY${Date.now()}${random}`;
}

interface InitiateTransactionResult {
  paytmOrderId: string;
  txnToken: string;
  amount: string;
}

/**
 * Calls Paytm's Initiate Transaction API to get a txnToken for CheckoutJS.
 * The request body is signed with the merchant key (never exposed to the
 * client) via PaytmChecksum — Paytm rejects any request whose signature
 * doesn't match, so this can't be forged from the browser.
 */
export async function initiateTransaction({
  amount,
  customerEmail,
  customerPhone,
}: {
  amount: number;
  customerEmail: string;
  customerPhone?: string;
}): Promise<InitiateTransactionResult> {
  const { mid, merchantKey, website, baseUrl } = getConfig();
  const paytmOrderId = generateOrderId();
  const amountStr = amount.toFixed(2);

  const callbackUrl = `${getAppUrl()}/api/payments/paytm/callback`;

  const body = {
    requestType: "Payment",
    mid,
    websiteName: website,
    orderId: paytmOrderId,
    callbackUrl,
    txnAmount: {
      value: amountStr,
      currency: "INR",
    },
    userInfo: {
      custId: customerEmail,
      ...(customerPhone ? { mobile: customerPhone } : {}),
    },
  };

  const signature = await PaytmChecksum.generateSignature(JSON.stringify(body), merchantKey);

  const res = await fetch(
    `${baseUrl}/theia/api/v1/initiateTransaction?mid=${encodeURIComponent(mid)}&orderId=${encodeURIComponent(paytmOrderId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, head: { signature } }),
    }
  );

  const data = await res.json();
  const resultStatus = data?.body?.resultInfo?.resultStatus;
  const txnToken = data?.body?.txnToken;

  if (resultStatus !== "S" || !txnToken) {
    const message = data?.body?.resultInfo?.resultMsg || "Failed to initiate Paytm transaction.";
    throw new Error(message);
  }

  return { paytmOrderId, txnToken, amount: amountStr };
}

export interface TransactionStatus {
  status: "TXN_SUCCESS" | "TXN_FAILURE" | "PENDING" | "UNKNOWN";
  txnId?: string;
  amount?: string;
}

/**
 * Authoritative payment confirmation: asks Paytm directly for the current
 * status of an order rather than trusting anything the browser reports.
 */
export async function getTransactionStatus(paytmOrderId: string): Promise<TransactionStatus> {
  const { mid, merchantKey, baseUrl } = getConfig();

  const body = { mid, orderId: paytmOrderId };
  const signature = await PaytmChecksum.generateSignature(JSON.stringify(body), merchantKey);

  const res = await fetch(`${baseUrl}/v3/order/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body, head: { signature } }),
  });

  const data = await res.json();
  const resultStatus = data?.body?.resultInfo?.resultStatus;

  const statusMap: Record<string, TransactionStatus["status"]> = {
    TXN_SUCCESS: "TXN_SUCCESS",
    TXN_FAILURE: "TXN_FAILURE",
    PENDING: "PENDING",
  };

  return {
    status: statusMap[resultStatus] ?? "UNKNOWN",
    txnId: data?.body?.txnId,
    amount: data?.body?.txnAmount,
  };
}

/** Verifies the checksum Paytm attaches to its server-to-server callback POST. */
export function verifyCallbackChecksum(body: Record<string, unknown>): boolean {
  const { merchantKey } = getConfig();
  const checksum = body.CHECKSUMHASH as string | undefined;
  if (!checksum) return false;
  const params = { ...body };
  delete params.CHECKSUMHASH;
  return PaytmChecksum.verifySignature(params, merchantKey, checksum);
}

function getAppUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  if (fromEnv) return fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
  return "http://localhost:3000";
}
