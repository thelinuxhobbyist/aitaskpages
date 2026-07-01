import type { Metadata } from "next";
import { SITE_LOGO_URL, SITE_URL } from "@/lib/site";

export const SITE_NAME = "AI Jobs Market";

export const SITE_TAGLINE =
  "The UK's home for AI experts, requirements, and jobs";

export const DEFAULT_DESCRIPTION =
  "AI Jobs Market connects UK businesses with independent AI experts. Search consultants, browse open requirements and AI jobs, or post what you need.";

export const ORGANIZATION_SAME_AS = [
  "https://www.linkedin.com/company/ai-jobs-market",
  "https://twitter.com/aijobsmarket",
  "https://www.youtube.com/@AIJobsMarket",
] as const;

export const GA_MEASUREMENT_ID = "G-JRRZ1CWQH9";

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  absoluteTitle,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  noIndex = false,
}: {
  title?: string;
  absoluteTitle?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  if (!title && !absoluteTitle) {
    throw new Error("createPageMetadata requires title or absoluteTitle");
  }

  const url = absoluteUrl(path);
  const titleValue = absoluteTitle ? { absolute: absoluteTitle } : title!;

  const shareTitle = absoluteTitle ?? title!;

  return {
    title: titleValue,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: shareTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_GB",
      type: "website",
      images: [{ url: SITE_LOGO_URL, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary",
      title: shareTitle,
      description,
      images: [SITE_LOGO_URL],
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}

export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — UK AI Experts, Jobs & Requirements`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: SITE_LOGO_URL,
      apple: SITE_LOGO_URL,
    },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} — UK AI Experts, Jobs & Requirements`,
      description: DEFAULT_DESCRIPTION,
      images: [{ url: SITE_LOGO_URL, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary",
      site: "@aijobsmarket",
      title: `${SITE_NAME} — UK AI Experts, Jobs & Requirements`,
      description: DEFAULT_DESCRIPTION,
      images: [SITE_LOGO_URL],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO_URL,
    description: DEFAULT_DESCRIPTION,
    sameAs: [...ORGANIZATION_SAME_AS],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@aijobsmarket.co.uk",
      availableLanguage: "English",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["AIJobsMarket", "aijobsmarket.co.uk"],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: SITE_LOGO_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
