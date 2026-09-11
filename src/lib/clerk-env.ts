import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-config";

export type ClerkEnvKeys = {
  secretKey?: string;
  publishableKey: string;
};

const SECRET_BINDING_KEYS = [
  "CLERK_SECRET_KEY",
  // Required when clerkMiddleware is given dynamic secretKey/publishableKey options.
  "CLERK_ENCRYPTION_KEY",
  "CLERK_WEBHOOK_SIGNING_SECRET",
  "RESEND_API_KEY",
  "TURNSTILE_SECRET_KEY",
  "ADMIN_API_KEY",
  "MARKETING_UNSUBSCRIBE_SECRET",
] as const;

/** Read env from ALS — same store OpenNext sets in runWithCloudflareRequestContext. */
function getRequestEnv(): Record<string, unknown> {
  const store = (
    globalThis as Record<symbol, { env: Record<string, unknown> } | undefined>
  )[Symbol.for("__cloudflare-context__")];
  if (store?.env) return store.env;
  try {
    return getCloudflareContext().env as unknown as Record<string, unknown>;
  } catch {
    return {};
  }
}

function readPublishableKey(env: Record<string, unknown>): string {
  // Local `next dev`: .env.local must win over wrangler.toml production vars.
  if (process.env.NODE_ENV === "development") {
    const fromProcess = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
    if (fromProcess) return fromProcess;
  }

  const fromBinding = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (typeof fromBinding === "string" && fromBinding) {
    return fromBinding;
  }
  return CLERK_PUBLISHABLE_KEY;
}

function readSecretKey(env: Record<string, unknown>): string | undefined {
  const fromBinding = env.CLERK_SECRET_KEY;
  if (typeof fromBinding === "string" && fromBinding) {
    return fromBinding;
  }
  return process.env.CLERK_SECRET_KEY;
}

/**
 * Copy Cloudflare secret bindings onto process.env.
 * OpenNext init uses Object.entries(env) which skips secrets — read each by name.
 *
 * Do not assign NEXT_PUBLIC_* keys here: Next inlines them at build time.
 */
export function syncClerkEnvFromBindings(): void {
  const env = getRequestEnv();
  for (const key of SECRET_BINDING_KEYS) {
    const value = env[key];
    if (typeof value === "string" && value) {
      process.env[key] = value;
    }
  }
}

/** Read Clerk keys — sync first for middleware/edge, async fallback for server components. */
export function getClerkEnvSync(): ClerkEnvKeys {
  syncClerkEnvFromBindings();
  const env = getRequestEnv();
  return {
    secretKey: readSecretKey(env),
    publishableKey: readPublishableKey(env),
  };
}

/** Read Clerk keys from Cloudflare bindings (with local/process fallbacks). */
export async function getClerkEnv(): Promise<ClerkEnvKeys> {
  syncClerkEnvFromBindings();
  const sync = getClerkEnvSync();
  if (sync.secretKey) return sync;

  try {
    const { env } = await getCloudflareContext({ async: true });
    return {
      secretKey: readSecretKey(env as unknown as Record<string, unknown>),
      publishableKey: readPublishableKey(env as unknown as Record<string, unknown>),
    };
  } catch {
    return {
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: CLERK_PUBLISHABLE_KEY,
    };
  }
}

/** Patch process.env so @clerk/nextjs/server helpers work in the Worker runtime. */
export async function syncClerkEnvToProcess(): Promise<void> {
  syncClerkEnvFromBindings();
  const { secretKey } = await getClerkEnv();
  if (secretKey) {
    process.env.CLERK_SECRET_KEY = secretKey;
  }
}
