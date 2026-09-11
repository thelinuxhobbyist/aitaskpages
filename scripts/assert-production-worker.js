#!/usr/bin/env node
/**
 * This repo deploys only to Worker "aitaskpages".
 * Refuse builds that target AI Jobs Market (aijobsmarket2) or any other Worker.
 */
const fs = require("node:fs");
const path = require("node:path");

const EXPECTED_WORKER = "aitaskpages";
const FORBIDDEN_WORKERS = [
  "aijobsmarket2",
  "aijobsmarket",
  "aimarketgroup",
  "aimarketgroup4",
];
const ciName = process.env.WRANGLER_CI_OVERRIDE_NAME;
const pages = process.env.CF_PAGES;

const wranglerPath = path.join(process.cwd(), "wrangler.toml");
const wranglerToml = fs.readFileSync(wranglerPath, "utf8");
const nameMatch = wranglerToml.match(/^\s*name\s*=\s*"([^"]+)"/m);
const configName = nameMatch?.[1];

if (!configName || configName !== EXPECTED_WORKER) {
  console.error(
    `Refusing to build: wrangler.toml name is "${configName ?? "(missing)"}" ` +
      `but must be "${EXPECTED_WORKER}".`,
  );
  process.exit(1);
}

if (FORBIDDEN_WORKERS.some((w) => wranglerToml.includes(`"${w}"`))) {
  console.error(
    `Refusing to build: wrangler.toml still references a forbidden AI Jobs Market Worker name.`,
  );
  process.exit(1);
}

if (pages === "1") {
  console.error(
    `Refusing to build: this repo deploys to Worker "${EXPECTED_WORKER}" only. ` +
      `Disconnect the GitHub repo from Cloudflare Pages.`,
  );
  process.exit(1);
}

if (ciName && FORBIDDEN_WORKERS.includes(ciName)) {
  console.error(
    `Refusing to build: Cloudflare is targeting "${ciName}", which belongs to ` +
      `AI Jobs Market. This repo must only deploy to "${EXPECTED_WORKER}".`,
  );
  process.exit(1);
}

if (ciName && ciName !== EXPECTED_WORKER) {
  console.error(
    `Refusing to build: this repo can only deploy to Worker "${EXPECTED_WORKER}". ` +
      `Cloudflare is targeting "${ciName}".`,
  );
  process.exit(1);
}
