import {
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export function SiteStructuredData() {
  const graphs = [organizationJsonLd(), websiteJsonLd()];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphs) }}
    />
  );
}
