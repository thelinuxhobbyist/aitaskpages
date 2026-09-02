export const SITE_URL = "https://aijobsmarket.co.uk";

const SITE_LOGO_CDN_BASE = "https://cdn.aijobsmarket.co.uk/images/logos";

function logoAsset(filename: string): string {
  return `${SITE_LOGO_CDN_BASE}/${encodeURIComponent(filename)}`;
}

/** Stacked colour lockup — light / white backgrounds (header, email, schema). */
export const SITE_LOGO_URL = logoAsset("AI JobsMarket-01.png");

/** @deprecated Use SITE_LOGO_URL — lockup is now a PNG. */
export const SITE_LOGO_SVG_URL = SITE_LOGO_URL;

/** Stacked lockup for dark surfaces (footer) — transparent PNG. */
export const SITE_LOGO_ON_DARK_URL = `${logoAsset("footer.png")}?v=1`;

/** @deprecated Use SITE_LOGO_ON_DARK_URL. */
export const SITE_LOGO_ON_DARK_SVG_URL = SITE_LOGO_ON_DARK_URL;

export const SITE_FAVICON_16_URL = logoAsset("16x16.png");
export const SITE_FAVICON_32_URL = logoAsset("32x32.png");

/** Square share/app icon (Twitter summary, apple-style previews). */
export const SITE_SHARE_ICON_URL = SITE_FAVICON_32_URL;

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
