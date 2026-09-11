/** Public site URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://aitaskpages.com";

/**
 * Brand assets served dynamically from R2 with live ETag revalidation.
 * Absolute URLs for OG/email; same-origin paths for in-app <img> first paint.
 */
export const SITE_LOGO_PATH = "/brand/logo.png";
export const SITE_LOGO_URL = `${SITE_URL}${SITE_LOGO_PATH}`;

/** @deprecated Use SITE_LOGO_URL — lockup is now a PNG. */
export const SITE_LOGO_SVG_URL = SITE_LOGO_URL;

/** Stacked lockup for dark surfaces (footer) — transparent PNG. */
export const SITE_LOGO_ON_DARK_PATH = "/brand/footer.png";
export const SITE_LOGO_ON_DARK_URL = `${SITE_URL}${SITE_LOGO_ON_DARK_PATH}`;

/** @deprecated Use SITE_LOGO_ON_DARK_URL. */
export const SITE_LOGO_ON_DARK_SVG_URL = SITE_LOGO_ON_DARK_URL;

export const SITE_FAVICON_16_URL = "/favicon-16x16.png";
export const SITE_FAVICON_32_URL = "/favicon-32x32.png";
export const SITE_FAVICON_48_URL = "/favicon-48x48.png";
export const SITE_FAVICON_96_URL = "/favicon-96x96.png";
export const SITE_FAVICON_192_URL = "/favicon-192x192.png";
export const SITE_FAVICON_512_URL = "/favicon-512x512.png";
export const SITE_FAVICON_SVG_URL = "/favicon.svg";
export const SITE_APPLE_TOUCH_ICON_URL = "/apple-touch-icon.png";
/** Same-origin ICO served dynamically from R2. */
export const SITE_FAVICON_ICO_URL = "/favicon.ico";

/** Square share/app icon (Twitter summary, apple-style previews). */
export const SITE_SHARE_ICON_URL = SITE_APPLE_TOUCH_ICON_URL;

/** Social links — replace with AI Task Pages accounts when ready. */
export const SOCIAL_LINKS = {
  linkedin: "",
  x: "",
  youtube: "",
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
