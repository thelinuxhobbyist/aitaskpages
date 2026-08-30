export const SITE_URL = "https://aijobsmarket.co.uk";

const SITE_LOGO_CDN_BASE = "https://cdn.aijobsmarket.co.uk/images/logos";

/** Colour horizontal lockup — light backgrounds (header, marketing, schema). */
export const SITE_LOGO_SVG_URL = `${SITE_LOGO_CDN_BASE}/lockup-horizontal-color.svg`;

/** White lockup — dark backgrounds (site footer). */
export const SITE_LOGO_ON_DARK_SVG_URL = `${SITE_LOGO_CDN_BASE}/lockup-horizontal-white.svg`;

/** Browser/app tile with the colour mark on blue. */
export const SITE_FAVICON_SVG_URL = `${SITE_LOGO_CDN_BASE}/favicon.svg`;

/** Single-colour mark — Safari pinned-tab mask. */
export const SITE_ICON_BLACK_SVG_URL = `${SITE_LOGO_CDN_BASE}/icon-black.svg`;

/**
 * Raster lockup for email clients and crawlers that do not fetch SVG.
 * Derived from lockup-horizontal-color.svg.
 */
export const SITE_LOGO_URL = `${SITE_URL}/brand/lockup-horizontal-color.png`;

/** Square share/app icon (Twitter summary, apple-style previews). */
export const SITE_SHARE_ICON_URL = `${SITE_URL}/icon-512.png`;

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/aijobsmarket/",
  x: "https://twitter.com/aijobsmarket",
  youtube: "https://www.youtube.com/@aijobsmarket",
} as const;

export function conversationUrl(conversationId: number): string {
  return `${SITE_URL}/dashboard/conversations/${conversationId}`;
}

export function requirementUrl(requirementId: number): string {
  return `${SITE_URL}/tasks/${requirementId}`;
}

/** @deprecated Use requirementUrl — public page is canonical. */
export function opportunityUrl(requirementId: number): string {
  return requirementUrl(requirementId);
}

export function interestedExpertsUrl(requirementId: number): string {
  return `${SITE_URL}/dashboard/requirements/${requirementId}/interested`;
}

export function expertProfileUrl(slug: string): string {
  return `${SITE_URL}/experts/${slug}`;
}
