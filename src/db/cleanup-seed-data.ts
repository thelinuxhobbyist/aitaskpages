/**
 * Remove demo/seed task data only (seed-demo-client user and related rows).
 * Does not touch real user accounts or catalog data.
 *
 * Usage:
 *   npm run db:cleanup:seed:local
 *   npm run db:cleanup:seed:remote
 */

import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const DEMO_CLERK_ID = "seed-demo-client";

const CLEANUP_SEED_SQL = `
DELETE FROM messages
WHERE conversation_id IN (
  SELECT c.id FROM conversations c
  JOIN users u ON u.id = c.client_user_id
  WHERE u.clerk_user_id = '${DEMO_CLERK_ID}'
);

DELETE FROM requirement_notifications
WHERE requirement_id IN (
  SELECT r.id FROM requirements r
  JOIN users u ON u.id = r.client_user_id
  WHERE u.clerk_user_id = '${DEMO_CLERK_ID}'
);

DELETE FROM requirement_interests
WHERE requirement_id IN (
  SELECT r.id FROM requirements r
  JOIN users u ON u.id = r.client_user_id
  WHERE u.clerk_user_id = '${DEMO_CLERK_ID}'
);

DELETE FROM requirement_skills
WHERE requirement_id IN (
  SELECT r.id FROM requirements r
  JOIN users u ON u.id = r.client_user_id
  WHERE u.clerk_user_id = '${DEMO_CLERK_ID}'
);

DELETE FROM requirement_services
WHERE requirement_id IN (
  SELECT r.id FROM requirements r
  JOIN users u ON u.id = r.client_user_id
  WHERE u.clerk_user_id = '${DEMO_CLERK_ID}'
);

DELETE FROM requirements
WHERE client_user_id IN (
  SELECT id FROM users WHERE clerk_user_id = '${DEMO_CLERK_ID}'
);

DELETE FROM conversations
WHERE client_user_id IN (
  SELECT id FROM users WHERE clerk_user_id = '${DEMO_CLERK_ID}'
);

DELETE FROM users WHERE clerk_user_id = '${DEMO_CLERK_ID}';
`.trim();

async function main() {
  const isRemote = process.argv.includes("--remote");
  const flag = isRemote ? "--remote" : "--local";
  const tmpFile = join(tmpdir(), `aijobsmarket-cleanup-seed-${Date.now()}.sql`);
  writeFileSync(tmpFile, CLEANUP_SEED_SQL);

  const target = isRemote ? "production" : "local";
  console.log(`Removing seed demo data from ${target} D1…`);

  try {
    execSync(`npx wrangler d1 execute aijobsmarket_db ${flag} --file=${tmpFile}`, {
      stdio: "inherit",
    });
    console.log("Seed cleanup complete.");
  } finally {
    unlinkSync(tmpFile);
  }
}

main().catch((err) => {
  console.error("Seed cleanup failed:", err);
  process.exit(1);
});
