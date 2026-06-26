import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-config";

export type ClerkEnvKeys = {
  secretKey?: string;
  publishableKey: string;
};

function readKeys(env: {
  CLERK_SECRET_KEY?: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
}): ClerkEnvKeys {
  return {
    secretKey: env.CLERK_SECRET_KEY ?? process.env.CLERK_SECRET_KEY,
    publishableKey:
      env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
      CLERK_PUBLISHABLE_KEY,
  };
}

/**
 * Copy Clerk bindings onto process.env.
 * Cloudflare secrets are not always included in Object.entries(env), so OpenNext's
 * init may skip them — read bindings directly by name.
 */
export function syncClerkEnvFromBindings(): void {
  try {
    const { env } = getCloudflareContext();
    if (typeof env.CLERK_SECRET_KEY === "string") {
      process.env.CLERK_SECRET_KEY = env.CLERK_SECRET_KEY;
    }
    if (typeof env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "string") {
      process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"] =
        env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    }
  } catch {
    // Local dev / outside worker runtime
  }
  process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"] ??= CLERK_PUBLISHABLE_KEY;
}

/** Read Clerk keys — sync first for middleware/edge, async fallback for server components. */
export function getClerkEnvSync(): ClerkEnvKeys {
  syncClerkEnvFromBindings();
  try {
    return readKeys(getCloudflareContext().env);
  } catch {
    return readKeys({
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    });
  }
}

/** Read Clerk keys from Cloudflare bindings (with local/process fallbacks). */
export async function getClerkEnv(): Promise<ClerkEnvKeys> {
  syncClerkEnvFromBindings();
  const sync = getClerkEnvSync();
  if (sync.secretKey) return sync;

  try {
    const { env } = await getCloudflareContext({ async: true });
    return readKeys(env);
  } catch {
    return readKeys({
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    });
  }
}

/**
 * Patch process.env so @clerk/nextjs/server helpers work in the Worker runtime.
 */
export async function syncClerkEnvToProcess(): Promise<void> {
  syncClerkEnvFromBindings();
  const { secretKey, publishableKey } = await getClerkEnv();
  if (secretKey) process.env.CLERK_SECRET_KEY = secretKey;
  process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"] = publishableKey;
}
