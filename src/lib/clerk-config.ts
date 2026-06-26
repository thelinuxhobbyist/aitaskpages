/**
 * Clerk publishable key — public, safe in client bundle.
 * Hardcoded so Cloudflare builds never ship an empty string when the
 * build env var is missing or set to "".
 */
export const CLERK_PUBLISHABLE_KEY =
  "pk_test_aG9uZXN0LW1hY2tlcmVsLTgzLmNsZXJrLmFjY291bnRzLmRldiQ";
