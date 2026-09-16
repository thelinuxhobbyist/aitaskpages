/** Cookie set after a successful `?preview=` bypass. */
export const COMING_SOON_COOKIE = "coming_soon_bypass";

/** Query param used to unlock or lock the public site. */
export const COMING_SOON_QUERY = "preview";

/**
 * Read a Worker/runtime env var without letting Next inline it at build time.
 * `process.env.NAME` in middleware is replaced during `next build`; a dynamic
 * key plus the Cloudflare request context keeps wrangler [vars] working.
 */
function readRuntimeEnv(name: string): string {
  const fromProcess = process.env[name];
  if (typeof fromProcess === "string" && fromProcess.trim()) {
    return fromProcess.trim();
  }

  const store = (
    globalThis as Record<symbol, { env: Record<string, unknown> } | undefined>
  )[Symbol.for("__cloudflare-context__")];
  const fromStore = store?.env?.[name];
  if (typeof fromStore === "string" && fromStore.trim()) {
    return fromStore.trim();
  }

  return "";
}

export function isComingSoonEnabled(): boolean {
  return readRuntimeEnv("COMING_SOON") === "1";
}

export function comingSoonBypassToken(): string {
  return readRuntimeEnv("COMING_SOON_BYPASS");
}

export function hasComingSoonBypass(cookieValue: string | undefined): boolean {
  const token = comingSoonBypassToken();
  return Boolean(token) && cookieValue === token;
}

/** True for public visitors while the cover is on. */
export function shouldServeComingSoonCover(
  cookieValue: string | undefined,
): boolean {
  return isComingSoonEnabled() && !hasComingSoonBypass(cookieValue);
}

/** Routes that must keep working while the public site is covered. */
export function isComingSoonExemptPath(pathname: string): boolean {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/__clerk") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/unsubscribe" ||
    pathname.startsWith("/unsubscribe/")
  );
}
