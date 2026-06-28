import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    IMAGES: R2Bucket;
    IMAGES_BASE_URL?: string;
    CLERK_SECRET_KEY?: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    MARKETING_EMAIL_FROM?: string;
    CLERK_WEBHOOK_SIGNING_SECRET?: string;
    ADMIN_API_KEY?: string;
    MARKETING_UNSUBSCRIBE_SECRET?: string;
    TURNSTILE_SECRET_KEY?: string;
    GOOGLE_SITE_VERIFICATION?: string;
  }
}

export {};
