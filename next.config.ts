import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // Existing static job pages in public/ remain served at /index.html, /job.html, etc.
};

export default nextConfig;
