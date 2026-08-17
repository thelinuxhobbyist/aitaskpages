export const SITE_URL = "https://aijobsmarket.co.uk";

export const SITE_LOGO_URL =
  "https://cdn.aijobsmarket.co.uk/images/logos/logo-01.png";

export const SITE_FAVICON_BASE =
  "https://cdn.aijobsmarket.co.uk/images/logos/favicon";

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/ai-jobs-market",
  x: "https://twitter.com/aijobsmarket",
  youtube: "https://www.youtube.com/@AIJobsMarket",
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
