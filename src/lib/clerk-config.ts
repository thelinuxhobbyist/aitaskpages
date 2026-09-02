/**
 * Clerk publishable key — public, safe in client bundle.
 *
 * Production always uses the live key. `next build` also loads `.env.local`,
 * so reading NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY here would bake pk_test_
 * into the live site and show Clerk's Development badge.
 *
 * Local `next dev` may override with NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 * (pk_test_). Production keys only work on aijobsmarket.co.uk.
 */
const PRODUCTION_PUBLISHABLE_KEY =
  "pk_live_Y2xlcmsuYWlqb2JzbWFya2V0LmNvLnVrJA";

export const CLERK_PUBLISHABLE_KEY =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ||
      PRODUCTION_PUBLISHABLE_KEY
    : PRODUCTION_PUBLISHABLE_KEY;
