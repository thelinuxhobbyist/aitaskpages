export const SITE_URL = "https://aijobsmarket.co.uk";

/**
 * Brand assets served dynamically from R2 with live ETag revalidation.
 * When files are updated or replaced on R2, changes are automatically
 * picked up across the site via HTTP 304 conditional revalidation.
 */
export const SITE_LOGO_URL = `${SITE_URL}/brand/logo.png`;

/** @deprecated Use SITE_LOGO_URL — lockup is now a PNG. */
export const SITE_LOGO_SVG_URL = SITE_LOGO_URL;

/** Stacked lockup for dark surfaces (footer) — transparent PNG. */
export const SITE_LOGO_ON_DARK_URL = `${SITE_URL}/brand/footer.png`;

/** @deprecated Use SITE_LOGO_ON_DARK_URL. */
export const SITE_LOGO_ON_DARK_SVG_URL = SITE_LOGO_ON_DARK_URL;

export const SITE_FAVICON_16_URL = "/brand/16x16-01.png";
export const SITE_FAVICON_32_URL = "/brand/32x32-01.png";
export const SITE_APPLE_TOUCH_ICON_URL = "/brand/apple-touch-icon.png";
/** Same-origin ICO served dynamically from R2. */
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
