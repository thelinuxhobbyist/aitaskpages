const DEFAULT_REDIRECT = "/dashboard";

/** Clerk redirect targets should be same-origin paths, not full URLs. */
export function normalizeAuthRedirectUrl(
  value: string | null | undefined
): string {
  if (!value) return DEFAULT_REDIRECT;

  try {
    const url = new URL(value, "https://aijobsmarket.co.uk");
    const path = `${url.pathname}${url.search}${url.hash}`;
    return path.startsWith("/") ? path : DEFAULT_REDIRECT;
  } catch {
    return value.startsWith("/") ? value : DEFAULT_REDIRECT;
  }
}

export function signInHref(redirectPath = DEFAULT_REDIRECT): string {
  return `/sign-in?redirect_url=${encodeURIComponent(redirectPath)}`;
}
