import type { MetadataRoute } from "next";
import { getPublicExpertSlugs } from "@/lib/directory";
import { getOpenRequirementIdsForSitemap } from "@/lib/requirements";
import { absoluteUrl } from "@/lib/seo";

/** Generated at request time — needs live D1 (not available during static export). */
export const dynamic = "force-dynamic";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
  { url: absoluteUrl("/search"), changeFrequency: "daily", priority: 0.9 },
  {
    url: absoluteUrl("/requirements"),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: absoluteUrl("/join-as-expert"),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
  { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/cookies"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/disclaimer"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/jobs.html"), changeFrequency: "daily", priority: 0.9 },
  {
    url: absoluteUrl("/ai-jobs-uk.html"),
    changeFrequency: "daily",
    priority: 0.85,
  },
  {
    url: absoluteUrl("/ai-jobs-london.html"),
    changeFrequency: "daily",
    priority: 0.85,
  },
  {
    url: absoluteUrl("/remote-ai-jobs-uk.html"),
    changeFrequency: "daily",
    priority: 0.85,
  },
];

async function getDynamicRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const [experts, requirements] = await Promise.all([
      getPublicExpertSlugs(),
      getOpenRequirementIdsForSitemap(),
    ]);

    const expertRoutes: MetadataRoute.Sitemap = experts.map((expert) => ({
      url: absoluteUrl(`/experts/${expert.slug}`),
      lastModified: expert.updatedAt ? new Date(expert.updatedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const requirementRoutes: MetadataRoute.Sitemap = requirements.map((req) => ({
      url: absoluteUrl(`/requirements/${req.id}`),
      lastModified: req.updatedAt ? new Date(req.updatedAt) : undefined,
      changeFrequency: "daily",
      priority: 0.75,
    }));

    return [...expertRoutes, ...requirementRoutes];
  } catch {
    // Build-time prerender or local D1 without migrations — static URLs only.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicRoutes = await getDynamicRoutes();
  return [...STATIC_ROUTES, ...dynamicRoutes];
}
