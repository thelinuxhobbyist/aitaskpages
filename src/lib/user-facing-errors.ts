/** Patterns for errors caused by stale JS after a deploy (action ID mismatch). */
const STALE_SERVER_ACTION =
  /Server Action .* was not found|failed-to-find-server-action/i;

const STALE_CHUNK =
  /Loading chunk \d+ failed|ChunkLoadError|failed to fetch dynamically imported module/i;

const TECHNICAL_PATTERNS = [
  STALE_SERVER_ACTION,
  STALE_CHUNK,
  /^Digest:/,
  /NEXT_REDIRECT/i,
  /NEXT_NOT_FOUND/i,
  /Clerk:/i,
  /auth\(\) was called/i,
  /clerkMiddleware/i,
];

export function isStaleServerActionError(error: unknown): boolean {
  const message = errorMessage(error);
  return STALE_SERVER_ACTION.test(message);
}

export function isStaleClientBundleError(error: unknown): boolean {
  const message = errorMessage(error);
  return STALE_SERVER_ACTION.test(message) || STALE_CHUNK.test(message);
}

export function errorLooksLikeStaleClient(message: string): boolean {
  return STALE_SERVER_ACTION.test(message) || STALE_CHUNK.test(message);
}

export function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "";
}

/**
 * Map thrown errors to copy safe to show visitors.
 * Server actions should return field errors in state; this covers unexpected throws.
 */
export function getUserFacingErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  const message = errorMessage(error).trim();
  if (!message) return fallback;

  if (isStaleClientBundleError(error)) {
    return "We've updated the site. Refresh the page and try again.";
  }

  if (TECHNICAL_PATTERNS.some((pattern) => pattern.test(message))) {
    return fallback;
  }

  return message;
}
