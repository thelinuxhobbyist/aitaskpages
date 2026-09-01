import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createDb, type Database } from "./index";

/**
 * Returns a Drizzle client bound to the Cloudflare D1 database.
 * Use in Server Components, Route Handlers, and Server Actions.
 */
export async function getDb(): Promise<Database> {
  try {
    const { env } = getCloudflareContext();
    return createDb(env.DB);
  } catch {
    const { env } = await getCloudflareContext({ async: true });
    return createDb(env.DB);
  }
}

function logD1Failure(label: string, error: unknown) {
  const cause = error instanceof Error ? error.cause : undefined;
  console.error(`D1 ${label} failed`, error, cause);
}

/** Retry a D1 read once — concurrent statements on the same binding can flake. */
export async function withD1Retry<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (first) {
    logD1Failure(label, first);
    try {
      return await fn();
    } catch (second) {
      logD1Failure(`${label} (retry)`, second);
      throw second;
    }
  }
}
