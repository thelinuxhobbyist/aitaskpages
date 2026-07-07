/**
 * Remove all user-generated marketplace content (tasks, expert profiles, messages).
 * Keeps catalog data (skills, services) and schema migrations.
 *
 * Usage:
 *   npm run db:cleanup:local
 *   npm run db:cleanup:remote
 */

import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const CLEANUP_SQL = `
DELETE FROM messages;
DELETE FROM requirement_notifications;
DELETE FROM requirement_interests;
DELETE FROM requirement_skills;
DELETE FROM requirement_services;
DELETE FROM requirements;
DELETE FROM contact_requests;
DELETE FROM conversations;
DELETE FROM freelancer_skills;
DELETE FROM freelancer_services;
DELETE FROM freelancer_profiles;
DELETE FROM users;
DELETE FROM sqlite_sequence WHERE name IN (
  'users',
  'freelancer_profiles',
  'requirements',
  'contact_requests',
  'conversations',
  'messages',
  'requirement_interests',
  'requirement_notifications'
);
`.trim();

async function main() {
  const isRemote = process.argv.includes("--remote");
  const flag = isRemote ? "--remote" : "--local";
  const tmpFile = join(tmpdir(), `aijobsmarket-cleanup-${Date.now()}.sql`);
  writeFileSync(tmpFile, CLEANUP_SQL);

  const target = isRemote ? "production" : "local";
  console.log(`Removing all user-generated content from ${target} D1…`);

  try {
    execSync(`npx wrangler d1 execute aijobsmarket_db ${flag} --file=${tmpFile}`, {
      stdio: "inherit",
    });
    console.log("Cleanup complete. Skills and services catalog were kept.");
  } finally {
    unlinkSync(tmpFile);
  }
}

main().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
