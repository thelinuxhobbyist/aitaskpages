import type { Metadata } from "next";
import {
  SITE_FAVICON_SVG_URL,
  SITE_LOGO_URL,
  SITE_SHARE_ICON_URL,
  SITE_URL,
} from "@/lib/site";

export const SITE_NAME = "AI Jobs Market";

/** Short brand line — experts & tasks first, not employment news. */
export const SITE_TAGLINE =
  "Find AI experts and post AI tasks across the UK. We make the introduction.";

/**
 * Default meta description. Written to distinguish the brand from the generic
 * phrase “AI jobs market” (employment news) and to state what the product is.
 */
export const DEFAULT_DESCRIPTION =
  "AI Jobs Market is an introduction platform connecting UK businesses with independent AI experts. Find an expert or post a task — we make the introduction, you take it from there.";

export const ORGANIZATION_SAME_AS = [
  "https://www.linkedin.com/company/aijobsmarket/",
  "https://twitter.com/aijobsmarket",
  "https://www.youtube.com/@aijobsmarket",
] as const;

export const BRAND_ALTERNATE_NAMES = [
  "AIJobsMarket",
  "aijobsmarket",
  "aijobsmarket.co.uk",
  "AI Jobs Market UK",
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
      images: [{ url: SITE_LOGO_URL, alt: `${SITE_NAME} logo` }],
    },
    twitter: {
      card: "summary",
      title: shareTitle,
      description,
      images: [SITE_SHARE_ICON_URL],
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}

/** Homepage / default document title — find experts or post a task. */
export const ROOT_TITLE = `${SITE_NAME} — Find AI Experts`;

export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: ROOT_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    keywords: [
      "AI Jobs Market",
      "AIJobsMarket",
      "AI experts UK",
      "AI consultants",
      "hire AI freelancer",
      "post AI task",
      "AI automation experts",
      "machine learning consultants UK",
    ],
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: SITE_FAVICON_SVG_URL, type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
        {
          url: "/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: ROOT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [{ url: SITE_LOGO_URL, alt: `${SITE_NAME} logo` }],
    },
    twitter: {
      card: "summary",
      site: "@aijobsmarket",
      title: ROOT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [SITE_SHARE_ICON_URL],
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
    "@type": ["Organization", "OnlineBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_NAME,
    alternateName: [...BRAND_ALTERNATE_NAMES],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: SITE_LOGO_URL,
    },
    image: SITE_LOGO_URL,
    description: DEFAULT_DESCRIPTION,
    slogan: SITE_TAGLINE,
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    knowsAbout: [
      "Artificial intelligence consulting",
      "AI freelancers and consultants",
      "AI automation and integrations",
      "Machine learning",
      "Custom AI solutions",
      "AI project requirements",
    ],
    sameAs: [...ORGANIZATION_SAME_AS],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@aijobsmarket.co.uk",
      availableLanguage: ["English"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: [...BRAND_ALTERNATE_NAMES],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "en-GB",
    publisher: { "@id": `${SITE_URL}/#organization` },
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

/** Combined graph for the global layout script. */
export function siteJsonLdGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), websiteJsonLd()],
  };
}
