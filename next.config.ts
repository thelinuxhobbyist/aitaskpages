import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import path from "path";
import { fileURLToPath } from "url";

initOpenNextCloudflareForDev();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CLERK_PUBLISHABLE_KEY =
  "pk_test_aG9uZXN0LW1hY2tlcmVsLTgzLmNsZXJrLmFjY291bnRzLmRldiQ";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  // Inline at build time so Cloudflare never ships an empty NEXT_PUBLIC_* value.
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: CLERK_PUBLISHABLE_KEY,
  },
  // Existing static job pages in public/ remain served at /index.html, /job.html, etc.
};

export default nextConfig;
