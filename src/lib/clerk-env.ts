import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-config";

export type ClerkEnvKeys = {
  secretKey?: string;
  publishableKey: string;
};

/** Read Clerk keys from Cloudflare bindings (with local/process fallbacks). */
export async function getClerkEnv(): Promise<ClerkEnvKeys> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return {
      secretKey: env.CLERK_SECRET_KEY ?? process.env.CLERK_SECRET_KEY,
      publishableKey:
        env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
        CLERK_PUBLISHABLE_KEY,
    };
  } catch {
    return {
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? CLERK_PUBLISHABLE_KEY,
    };
  }
}

/**
 * Patch process.env so @clerk/nextjs/server helpers work in the Worker runtime.
 * Cloudflare secrets are bindings — they are not always visible on process.env.
 */
export async function syncClerkEnvToProcess(): Promise<void> {
  const { secretKey, publishableKey } = await getClerkEnv();
  if (secretKey) process.env.CLERK_SECRET_KEY = secretKey;
  // Avoid direct process.env.NEXT_PUBLIC_* assignment — Next may inline it at build time.
  process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"] = publishableKey;
}
