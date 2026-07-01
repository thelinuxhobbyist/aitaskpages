import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import path from "path";
import { fileURLToPath } from "url";

initOpenNextCloudflareForDev();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    // Avoid webpack minifier crash during production builds (Next 15 + Tailwind v4).
    serverMinification: false,
  },
  // Existing static job pages in public/ remain served at /index.html, /job.html, etc.
  async redirects() {
    return [
      {
        source: "/requirements",
        destination: "/tasks",
        permanent: true,
      },
      {
        source: "/requirements/:path*",
        destination: "/tasks/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
