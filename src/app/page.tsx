import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HomePage as PlatformHomePage } from "@/app/home/page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  absoluteTitle: "AI Jobs Market — UK AI Experts, Jobs & Requirements",
  description:
    "AI Jobs Market is the UK's platform for AI experts, open requirements, and AI jobs. Search consultants, browse opportunities, or post what you need.",
  path: "/",
});

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Legacy/bookmarked homepage searches → dedicated results page.
  const hasSearch = Object.entries(params).some(([, value]) => {
    if (typeof value === "string") return value.length > 0;
    if (Array.isArray(value)) return value.some((v) => v.length > 0);
    return false;
  });

  if (hasSearch) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string") query.set(key, value);
      else if (Array.isArray(value))
        value.forEach((v) => query.append(key, v));
    }
    redirect(`/search?${query.toString()}`);
  }

  return <PlatformHomePage />;
}
