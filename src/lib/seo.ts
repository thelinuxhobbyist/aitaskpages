import type { Metadata } from "next";
import {
  SITE_APPLE_TOUCH_ICON_URL,
  SITE_FAVICON_16_URL,
  SITE_FAVICON_32_URL,
  SITE_FAVICON_48_URL,
  SITE_FAVICON_96_URL,
  SITE_FAVICON_192_URL,
  SITE_FAVICON_512_URL,
  SITE_FAVICON_SVG_URL,
  SITE_FAVICON_ICO_URL,
  SITE_LOGO_URL,
  SITE_SHARE_ICON_URL,
  SITE_URL,
} from "@/lib/site";
import { truncateDescription } from "@/lib/requirement-utils";
import { taskOpeningSummary } from "@/lib/task-description";

export const SITE_NAME = "AI Task Pages";

/** Short brand line — introduction platform, not recruitment. */
export const SITE_TAGLINE =
  "Find AI experts for your tasks, projects and AI challenges.";

/**
 * Default / homepage meta description. Positions the brand as a place to post
 * AI tasks and find AI expertise — not a jobs board or employment site.
 */
export const DEFAULT_DESCRIPTION =
  "AI Task Pages helps businesses and individuals find AI experts for specific tasks, projects and challenges. Post a task or find the right expertise.";

/** Homepage Open Graph description (slightly shorter / social-friendly). */
export const HOME_OG_DESCRIPTION =
  "Find AI experts for your tasks, projects and AI challenges. Post a task or discover the right expertise.";

/** Empty until a dedicated AI Task Pages GA property is configured. */
export const ORGANIZATION_SAME_AS = [] as const;

export const BRAND_ALTERNATE_NAMES = [
  "AITaskPages",
  "aitaskpages",
  "aitaskpages.com",
] as const;

/** Empty until a dedicated AI Task Pages GA property is configured. */
export const GA_MEASUREMENT_ID = "";

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageTitle(segment: string): string {
  return `${segment} | ${SITE_NAME}`;
}

export function createPageMetadata({
  title,
  absoluteTitle,
  description = DEFAULT_DESCRIPTION,
  openGraphDescription,
  path = "/",
  noIndex = false,
}: {
  title?: string;
  absoluteTitle?: string;
  description?: string;
  openGraphDescription?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  if (!title && !absoluteTitle) {
    throw new Error("createPageMetadata requires title or absoluteTitle");
  }

  const url = absoluteUrl(path);
  const titleValue = absoluteTitle ? { absolute: absoluteTitle } : title!;
  const shareTitle = absoluteTitle ?? pageTitle(title!);
  const shareDescription = openGraphDescription ?? description;

  return {
    title: titleValue,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: shareTitle,
      description: shareDescription,
      url,
      siteName: SITE_NAME,
      locale: "en_GB",
      type: "website",
      images: [{ url: SITE_LOGO_URL, alt: `${SITE_NAME} logo` }],
    },
    twitter: {
      card: "summary",
      title: shareTitle,
      description: shareDescription,
      images: [SITE_SHARE_ICON_URL],
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}

/** Homepage / default document title — short and descriptive. */
export const ROOT_TITLE = `${SITE_NAME} | Find AI Experts`;

export function rootMetadata(): Metadata {
  const homeUrl = absoluteUrl("/");

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
      "AI Task Pages",
      "AITaskPages",
      "AI experts",
      "AI tasks",
      "AI expertise",
      "find AI help",
      "post an AI task",
    ],
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        {
          url: SITE_FAVICON_SVG_URL,
          type: "image/svg+xml",
        },
        {
          url: SITE_FAVICON_ICO_URL,
          sizes: "any",
        },
        {
          url: SITE_FAVICON_48_URL,
          sizes: "48x48",
          type: "image/png",
        },
        {
          url: SITE_FAVICON_96_URL,
          sizes: "96x96",
          type: "image/png",
        },
        {
          url: SITE_FAVICON_192_URL,
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: SITE_FAVICON_32_URL,
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: SITE_FAVICON_16_URL,
          sizes: "16x16",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: SITE_APPLE_TOUCH_ICON_URL,
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: homeUrl,
      siteName: SITE_NAME,
      title: ROOT_TITLE,
      description: HOME_OG_DESCRIPTION,
      images: [{ url: SITE_LOGO_URL, alt: `${SITE_NAME} logo` }],
    },
    twitter: {
      card: "summary",
      title: ROOT_TITLE,
      description: HOME_OG_DESCRIPTION,
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
      canonical: homeUrl,
    },
  };
}

/** True when a headline already reads like a short role/specialty label. */
export function looksLikeSpecialtyHeadline(headline: string): boolean {
  const trimmed = headline.trim();
  if (trimmed.length < 4 || trimmed.length > 40) return false;
  if (/[.!?]$/.test(trimmed)) return false;
  const words = trimmed.split(/\s+/);
  if (words.length > 6) return false;
  // Reject bio-like fragments that are not useful in a browser title.
  if (
    /\b(years?|experience|expereince|passionate|helping|looking|based|available|freelance)\b/i.test(
      trimmed,
    )
  ) {
    return false;
  }
  return /\b(ai|ml|llm|nlp|machine learning|automation|data science|expert|specialist|engineer|consultant|developer|scientist)\b/i.test(
    trimmed,
  );
}

export function expertProfileTitle(
  fullName: string,
  opts: { company: boolean; headline?: string | null },
): string {
  if (opts.company) return `${fullName} | AI Services`;
  const headline = opts.headline?.trim();
  if (headline && looksLikeSpecialtyHeadline(headline)) {
    return `${fullName} | ${headline}`;
  }
  return `${fullName} | AI Expert`;
}

export function expertProfileDescription(
  fullName: string,
  opts: {
    company: boolean;
    headline?: string | null;
    bio?: string | null;
    skillLabels?: string[];
  },
): string {
  const skillLabels = (opts.skillLabels ?? [])
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const skillPhrase =
    skillLabels.length === 0
      ? null
      : skillLabels.length === 1
        ? skillLabels[0]
        : `${skillLabels.slice(0, -1).join(", ")} and ${skillLabels.at(-1)}`;

  const bio = opts.bio?.replace(/\s+/g, " ").trim();
  if (bio) {
    const lead = opts.company
      ? `${fullName} offers AI services on ${SITE_NAME}.`
      : `${fullName} is an AI specialist on ${SITE_NAME}.`;
    return truncateDescription(`${lead} ${bio}`, 160);
  }

  const headline = opts.headline?.replace(/\s+/g, " ").trim();
  if (headline) {
    return truncateDescription(
      opts.company
        ? `${fullName} — ${headline}. View their company profile on ${SITE_NAME}.`
        : `${fullName} is an AI specialist offering ${headline}. View their profile on ${SITE_NAME}.`,
      160,
    );
  }

  if (skillPhrase) {
    return opts.company
      ? `${fullName} is a company offering ${skillPhrase} on ${SITE_NAME}. View their profile and services.`
      : `${fullName} is an AI specialist offering ${skillPhrase}. View their profile on ${SITE_NAME}.`;
  }

  return opts.company
    ? `${fullName} provides AI services on ${SITE_NAME}. View their company profile.`
    : `${fullName} is an AI expert on ${SITE_NAME}. View their profile and get in touch.`;
}

export function taskPageDescription(title: string, description: string): string {
  const normalized = description.replace(/\s+/g, " ").trim();
  const summary = taskOpeningSummary(normalized, 155);
  if (summary.length >= 40) return summary;
  return truncateDescription(
    `Looking for an AI specialist for “${title}”. ${summary} View the task and see the expertise required.`,
    160,
  );
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
    knowsAbout: [
      "AI experts and specialists",
      "AI tasks and projects",
      "Finding help with AI",
      "AI automation and integrations",
      "Machine learning expertise",
    ],
    ...(ORGANIZATION_SAME_AS.length > 0
      ? { sameAs: [...ORGANIZATION_SAME_AS] }
      : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@aitaskpages.com",
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
