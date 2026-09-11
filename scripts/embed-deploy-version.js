/**
 * Embed .next/BUILD_ID into the client/server bundle so we can detect stale tabs
 * after a deploy and reload before server actions fail.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
let buildId = "development";

try {
  buildId = readFileSync(join(root, ".next/BUILD_ID"), "utf8").trim();
} catch {
  console.warn(
    "embed-deploy-version: .next/BUILD_ID not found, using development"
  );
}

const outDir = join(root, "src/generated");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "deploy-version.ts"),
  `// Generated during production builds — do not edit.\nexport const DEPLOY_VERSION = ${JSON.stringify(buildId)};\n`
);

console.log(`embed-deploy-version: ${buildId}`);
