/**
 * Clerk publishable key — public, safe in client bundle.
 *
 * Prefer NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from the environment.
 * Production builds must use keys from a NEW Clerk application for AI Task Pages —
 * never reuse AI Jobs Market Clerk keys.
 */
export const CLERK_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || "";
