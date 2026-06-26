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
