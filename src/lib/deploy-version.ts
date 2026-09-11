import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DEPLOY_VERSION } from "@/generated/deploy-version";

let cachedBuildId: string | null = null;

async function readBuildIdFromAssets(): Promise<string | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const response = await env.ASSETS.fetch("https://deploy.local/BUILD_ID");
    if (!response.ok) return null;
    const buildId = (await response.text()).trim();
    return buildId || null;
  } catch {
    return null;
  }
}

function readBuildIdFromNextOutput(): string | null {
  try {
    const buildId = readFileSync(
      join(process.cwd(), ".next/BUILD_ID"),
      "utf8"
    ).trim();
    return buildId || null;
  } catch {
    return null;
  }
}

/** Current deploy build ID — reads live BUILD_ID asset in production. */
export async function getDeployVersion(): Promise<string> {
  if (cachedBuildId) return cachedBuildId;

  const fromAssets = await readBuildIdFromAssets();
  if (fromAssets) {
    cachedBuildId = fromAssets;
    return fromAssets;
  }

  const fromNextOutput = readBuildIdFromNextOutput();
  if (fromNextOutput) {
    cachedBuildId = fromNextOutput;
    return fromNextOutput;
  }

  return DEPLOY_VERSION;
}
