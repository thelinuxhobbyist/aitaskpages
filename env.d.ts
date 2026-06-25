import type { D1Database } from "@cloudflare/workers-types";

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    CLERK_SECRET_KEY?: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
    CLERK_PUBLISHABLE_KEY?: string;
    RESEND_API_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
  }
}

export {};
