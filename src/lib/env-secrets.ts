import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getEnvSecret(name: string): string | undefined {
  try {
    const { env } = getCloudflareContext();
    const value = (env as unknown as Record<string, unknown>)[name];
    if (typeof value === "string" && value) return value;
  } catch {
    const value = process.env[name];
    if (value) return value;
  }
  return undefined;
}

export function requireEnvSecret(name: string): string {
  const value = getEnvSecret(name);
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}
