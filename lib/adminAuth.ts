/**
 * Signed admin session tokens using Web Crypto (HMAC-SHA256), so this works
 * identically in middleware (Edge runtime) and in Server Actions/Route
 * Handlers (Node runtime) without relying on Node's `crypto` module.
 *
 * Token shape: "<expiresAtUnixSeconds>.<hexSignature>"
 * The signature covers the expiry so a token can't be tampered with or
 * reused past its expiry.
 */

export const ADMIN_SESSION_COOKIE = "nova_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getHmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createAdminSessionToken(secret: string): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expiresAt);
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${bytesToHex(signature)}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  const [payload, signatureHex] = token.split(".");
  if (!payload || !signatureHex) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
    return false;
  }

  try {
    const key = await getHmacKey(secret);
    return await crypto.subtle.verify(
      "HMAC",
      key,
      hexToBytes(signatureHex) as BufferSource,
      encoder.encode(payload)
    );
  } catch {
    return false;
  }
}

/** Constant-time string comparison for the admin password check. */
export async function safeCompare(a: string, b: string): Promise<boolean> {
  const key = await getHmacKey("nova-admin-password-compare");
  const [macA, macB] = await Promise.all([
    crypto.subtle.sign("HMAC", key, encoder.encode(a)),
    crypto.subtle.sign("HMAC", key, encoder.encode(b)),
  ]);
  const bytesA = new Uint8Array(macA);
  const bytesB = new Uint8Array(macB);
  if (bytesA.length !== bytesB.length) return false;
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) diff |= bytesA[i] ^ bytesB[i];
  return diff === 0;
}
