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

/** Read Clerk keys — sync first for middleware/edge, async fallback for server components. */
export function getClerkEnvSync(): ClerkEnvKeys {
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
 * Cloudflare secrets are bindings — they are not always visible on process.env.
 */
export async function syncClerkEnvToProcess(): Promise<void> {
  const { secretKey, publishableKey } = await getClerkEnv();
  if (secretKey) process.env.CLERK_SECRET_KEY = secretKey;
  process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"] = publishableKey;
}
