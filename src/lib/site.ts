export const SITE_URL = "https://aijobsmarket.co.uk";

const SITE_LOGO_CDN_BASE = "https://cdn.aijobsmarket.co.uk/images/logos";

function logoAsset(filename: string): string {
  return `${SITE_LOGO_CDN_BASE}/${encodeURIComponent(filename)}`;
}

/** Bump when replacing R2 objects at the same key so CDN/browser caches miss. */
const SITE_LOGO_CACHE = "v=2";

/** Stacked colour lockup — light / white backgrounds (header, email, schema). */
export const SITE_LOGO_URL = `${logoAsset("AI JobsMarket-01.png")}?${SITE_LOGO_CACHE}`;

/** @deprecated Use SITE_LOGO_URL — lockup is now a PNG. */
export const SITE_LOGO_SVG_URL = SITE_LOGO_URL;

/** Stacked lockup for dark surfaces (footer) — transparent PNG. */
export const SITE_LOGO_ON_DARK_URL = `${logoAsset("footer.png")}?${SITE_LOGO_CACHE}`;

/** @deprecated Use SITE_LOGO_ON_DARK_URL. */
export const SITE_LOGO_ON_DARK_SVG_URL = SITE_LOGO_ON_DARK_URL;

export const SITE_FAVICON_16_URL = logoAsset("16x16-01.png");
export const SITE_FAVICON_32_URL = logoAsset("32x32-01.png");
export const SITE_APPLE_TOUCH_ICON_URL = "/apple-touch-icon.png";
/** Same-origin ICO built from the CDN 16×16 and 32×32 PNGs. */
export const SITE_FAVICON_ICO_URL = "/favicon.ico";

/** Square share/app icon (Twitter summary, apple-style previews). */
export const SITE_SHARE_ICON_URL = SITE_APPLE_TOUCH_ICON_URL;

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
