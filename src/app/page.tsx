import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HomePage as PlatformHomePage } from "@/app/home/page-content";
import { createPageMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  absoluteTitle: `${SITE_NAME} — Find AI Experts & Post AI Tasks in the UK`,
  description:
    "AI Jobs Market is the UK platform for finding independent AI experts and posting AI tasks, projects and requirements. Search consultants for AI consulting, automation, integrations and machine learning — then connect directly.",
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
