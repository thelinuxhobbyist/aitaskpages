#!/usr/bin/env node
/**
 * This repo has one production Worker: aijobsmarket2 (aijobsmarket.co.uk).
 * Cloudflare Workers Builds sets WRANGLER_CI_OVERRIDE_NAME to the dashboard
 * app name, so connecting the same GitHub repo to a new app silently deploys
 * a duplicate. Fail those builds instead.
 */
const EXPECTED_WORKER = "aijobsmarket2";
const ciName = process.env.WRANGLER_CI_OVERRIDE_NAME;
const pages = process.env.CF_PAGES;

if (pages === "1") {
  console.error(
    `Refusing to build: this repo deploys to Worker "${EXPECTED_WORKER}" only ` +
      `(aijobsmarket.co.uk). Disconnect the GitHub repo from Cloudflare Pages.`,
  );
  process.exit(1);
}

if (ciName && ciName !== EXPECTED_WORKER) {
  console.error(
    `Refusing to build: this repo can only deploy to Worker "${EXPECTED_WORKER}". ` +
      `Cloudflare is targeting "${ciName}". Open aijobsmarket2 in the dashboard ` +
      `instead of creating a new application.`,
  );
  process.exit(1);
}
