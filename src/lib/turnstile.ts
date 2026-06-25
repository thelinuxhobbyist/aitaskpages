import { getCloudflareContext } from "@opennextjs/cloudflare";

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export function isTurnstileConfigured(): boolean {
  try {
    const { env } = getCloudflareContext();
    return !!(
      env.TURNSTILE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    );
  } catch {
    return !!(
      process.env.TURNSTILE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    );
  }
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  let secret: string | undefined;

  try {
    const { env } = getCloudflareContext();
    secret = env.TURNSTILE_SECRET_KEY;
  } catch {
    secret = process.env.TURNSTILE_SECRET_KEY;
  }

  if (!secret) return true;

  if (!token) return false;

  const body: Record<string, string> = {
    secret,
    response: token,
  };
  if (remoteIp) body.remoteip = remoteIp;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = (await res.json()) as TurnstileResponse;
  return data.success === true;
}

export function getTurnstileSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}
