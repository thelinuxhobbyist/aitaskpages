import { getEnvSecret, requireEnvSecret } from "@/lib/env-secrets";
import { SITE_URL } from "@/lib/site";

const TOKEN_VERSION = "v1";

function secret(): string {
  return (
    getEnvSecret("MARKETING_UNSUBSCRIBE_SECRET") ??
    getEnvSecret("ADMIN_API_KEY") ??
    requireEnvSecret("CLERK_SECRET_KEY")
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function sign(userId: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const payload = `${TOKEN_VERSION}:${userId}`;
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return `${userId}.${toBase64Url(sig)}`;
}

async function verify(token: string): Promise<number | null> {
  const [idPart, sigPart] = token.split(".");
  if (!idPart || !sigPart) return null;
  const userId = Number(idPart);
  if (!Number.isInteger(userId) || userId <= 0) return null;

  const expected = await sign(userId);
  const [, expectedSig] = expected.split(".");
  if (sigPart !== expectedSig) return null;
  return userId;
}

export async function createUnsubscribeToken(userId: number): Promise<string> {
  return sign(userId);
}

export async function parseUnsubscribeToken(
  token: string
): Promise<number | null> {
  return verify(token);
}

export async function unsubscribeUrl(userId: number): Promise<string> {
  const token = await createUnsubscribeToken(userId);
  return `${SITE_URL}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}
