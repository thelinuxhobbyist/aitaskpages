import type { MetadataRoute } from "next";
import { isComingSoonEnabled } from "@/lib/coming-soon";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (isComingSoonEnabled()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      host: absoluteUrl("/"),
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/sign-in/",
          "/sign-up/",
          "/account/",
          "/api/",
          "/unsubscribe",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
