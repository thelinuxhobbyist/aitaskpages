import { siteJsonLdGraph } from "@/lib/seo";

export function SiteStructuredData() {
  const graph = siteJsonLdGraph();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
