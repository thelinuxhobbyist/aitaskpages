/**
 * Clerk publishable key — public, safe in client bundle.
 *
 * Prefer NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (e.g. pk_test_ in .env.local for
 * `next dev`). Fall back to the production key so Cloudflare builds never
 * ship an empty string when the build env var is missing or set to "".
 *
 * Production (pk_live_) keys only work on aijobsmarket.co.uk — use a Clerk
 * Development instance (pk_test_ / sk_test_) for localhost.
 */
export const CLERK_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ||
  "pk_live_Y2xlcmsuYWlqb2JzbWFya2V0LmNvLnVrJA";
