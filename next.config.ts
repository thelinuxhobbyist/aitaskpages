import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import path from "path";
import { fileURLToPath } from "url";

initOpenNextCloudflareForDev();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  // NOTE: `experimental.serverMinification: false` was previously set here to
  // work around a webpack minifier crash (Next 15 + Tailwind v4). Leaving it
  // off makes webpack emit eval()-based module wrappers, which Cloudflare
  // Workers reject at runtime ("Code generation from strings disallowed"),
  // 500ing every route. The crash no longer reproduces on Next 15.5.x.
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
  async rewrites() {
    return [
      {
        source: "/jobs",
        destination: "/jobs.html",
      },
    ];
  },
};

export default nextConfig;
