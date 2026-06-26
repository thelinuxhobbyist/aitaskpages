import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-config";

export type ClerkEnvKeys = {
  secretKey?: string;
  publishableKey: string;
};

function readPublishableKey(env: {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
}): string {
  if (
    typeof env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "string" &&
    env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  ) {
    return env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  }
  return CLERK_PUBLISHABLE_KEY;
}

function readSecretKey(env: { CLERK_SECRET_KEY?: string }): string | undefined {
  if (typeof env.CLERK_SECRET_KEY === "string") {
    return env.CLERK_SECRET_KEY;
  }
  return process.env.CLERK_SECRET_KEY;
}

/**
 * Copy Clerk secret from Cloudflare bindings onto process.env.
 * Secrets are not always included in Object.entries(env), so OpenNext's init
 * may skip them — read the binding directly by name.
 *
 * Do not assign NEXT_PUBLIC_* keys here: Next inlines them at build time and
 * breaks `process.env["NEXT_PUBLIC_..."] = ...` (Assigning to rvalue).
 */
export function syncClerkEnvFromBindings(): void {
  try {
    const { env } = getCloudflareContext();
    if (typeof env.CLERK_SECRET_KEY === "string") {
      process.env.CLERK_SECRET_KEY = env.CLERK_SECRET_KEY;
    }
  } catch {
    // Local dev / outside worker runtime
  }
}

/** Read Clerk keys — sync first for middleware/edge, async fallback for server components. */
export function getClerkEnvSync(): ClerkEnvKeys {
  syncClerkEnvFromBindings();
  try {
    const { env } = getCloudflareContext();
    return {
      secretKey: readSecretKey(env),
      publishableKey: readPublishableKey(env),
    };
  } catch {
    return {
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: CLERK_PUBLISHABLE_KEY,
    };
  }
}

/** Read Clerk keys from Cloudflare bindings (with local/process fallbacks). */
export async function getClerkEnv(): Promise<ClerkEnvKeys> {
  syncClerkEnvFromBindings();
  const sync = getClerkEnvSync();
  if (sync.secretKey) return sync;

  try {
    const { env } = await getCloudflareContext({ async: true });
    return {
      secretKey: readSecretKey(env),
      publishableKey: readPublishableKey(env),
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
