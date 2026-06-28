import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "About AI Jobs Market — the UK's home for AI experts, open requirements, and AI jobs.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About AI Jobs Market"
      intro="The UK's home for AI experts and AI jobs."
    />
  );
}
