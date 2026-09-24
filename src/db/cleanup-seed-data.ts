/**
 * Remove demo/seed marketplace data only:
 * - seed-demo-client (sample tasks)
 * - seed-company-* (sample company profiles)
 * - seed-expert-* (sample individual profiles)
 *
 * Does not touch real Clerk user accounts or catalog data (skills/services).
 *
 * Usage:
 *   npm run db:cleanup:seed:local
 *   npm run db:cleanup:seed:remote
 */

import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const CLEANUP_SEED_SQL = `
DELETE FROM messages
WHERE conversation_id IN (
  SELECT c.id FROM conversations c
  WHERE c.client_user_id IN (
    SELECT id FROM users
    WHERE clerk_user_id = 'seed-demo-client'
       OR clerk_user_id LIKE 'seed-company-%'
       OR clerk_user_id LIKE 'seed-expert-%'
  )
  OR c.freelancer_id IN (
    SELECT fp.id FROM freelancer_profiles fp
    JOIN users u ON u.id = fp.user_id
    WHERE u.clerk_user_id = 'seed-demo-client'
       OR u.clerk_user_id LIKE 'seed-company-%'
       OR u.clerk_user_id LIKE 'seed-expert-%'
  )
);

DELETE FROM requirement_notifications
WHERE requirement_id IN (
  SELECT r.id FROM requirements r
  JOIN users u ON u.id = r.client_user_id
  WHERE u.clerk_user_id = 'seed-demo-client'
     OR u.clerk_user_id LIKE 'seed-company-%'
       OR u.clerk_user_id LIKE 'seed-expert-%'
)
OR expert_id IN (
  SELECT fp.id FROM freelancer_profiles fp
  JOIN users u ON u.id = fp.user_id
  WHERE u.clerk_user_id = 'seed-demo-client'
     OR u.clerk_user_id LIKE 'seed-company-%'
       OR u.clerk_user_id LIKE 'seed-expert-%'
);

DELETE FROM requirement_interests
WHERE requirement_id IN (
  SELECT r.id FROM requirements r
  JOIN users u ON u.id = r.client_user_id
  WHERE u.clerk_user_id = 'seed-demo-client'
     OR u.clerk_user_id LIKE 'seed-company-%'
       OR u.clerk_user_id LIKE 'seed-expert-%'
)
OR expert_id IN (
  SELECT fp.id FROM freelancer_profiles fp
  JOIN users u ON u.id = fp.user_id
  WHERE u.clerk_user_id = 'seed-demo-client'
     OR u.clerk_user_id LIKE 'seed-company-%'
       OR u.clerk_user_id LIKE 'seed-expert-%'
);

DELETE FROM requirement_skills
WHERE requirement_id IN (
  SELECT r.id FROM requirements r
  JOIN users u ON u.id = r.client_user_id
  WHERE u.clerk_user_id = 'seed-demo-client'
     OR u.clerk_user_id LIKE 'seed-company-%'
       OR u.clerk_user_id LIKE 'seed-expert-%'
);

DELETE FROM requirement_services
WHERE requirement_id IN (
  SELECT r.id FROM requirements r
  JOIN users u ON u.id = r.client_user_id
  WHERE u.clerk_user_id = 'seed-demo-client'
     OR u.clerk_user_id LIKE 'seed-company-%'
       OR u.clerk_user_id LIKE 'seed-expert-%'
);

DELETE FROM requirements
WHERE client_user_id IN (
  SELECT id FROM users
  WHERE clerk_user_id = 'seed-demo-client'
     OR clerk_user_id LIKE 'seed-company-%'
       OR clerk_user_id LIKE 'seed-expert-%'
);

DELETE FROM contact_requests
WHERE freelancer_id IN (
  SELECT fp.id FROM freelancer_profiles fp
  JOIN users u ON u.id = fp.user_id
  WHERE u.clerk_user_id = 'seed-demo-client'
     OR u.clerk_user_id LIKE 'seed-company-%'
       OR u.clerk_user_id LIKE 'seed-expert-%'
);

DELETE FROM conversations
WHERE client_user_id IN (
  SELECT id FROM users
  WHERE clerk_user_id = 'seed-demo-client'
     OR clerk_user_id LIKE 'seed-company-%'
       OR clerk_user_id LIKE 'seed-expert-%'
)
OR freelancer_id IN (
  SELECT fp.id FROM freelancer_profiles fp
  JOIN users u ON u.id = fp.user_id
  WHERE u.clerk_user_id = 'seed-demo-client'
     OR u.clerk_user_id LIKE 'seed-company-%'
       OR u.clerk_user_id LIKE 'seed-expert-%'
);

DELETE FROM freelancer_skills
WHERE freelancer_id IN (
  SELECT fp.id FROM freelancer_profiles fp
  JOIN users u ON u.id = fp.user_id
  WHERE u.clerk_user_id = 'seed-demo-client'
     OR u.clerk_user_id LIKE 'seed-company-%'
       OR u.clerk_user_id LIKE 'seed-expert-%'
);

DELETE FROM freelancer_services
WHERE freelancer_id IN (
  SELECT fp.id FROM freelancer_profiles fp
  JOIN users u ON u.id = fp.user_id
  WHERE u.clerk_user_id = 'seed-demo-client'
     OR u.clerk_user_id LIKE 'seed-company-%'
       OR u.clerk_user_id LIKE 'seed-expert-%'
);

DELETE FROM freelancer_profiles
WHERE user_id IN (
  SELECT id FROM users
  WHERE clerk_user_id = 'seed-demo-client'
     OR clerk_user_id LIKE 'seed-company-%'
       OR clerk_user_id LIKE 'seed-expert-%'
);

DELETE FROM users
WHERE clerk_user_id = 'seed-demo-client'
   OR clerk_user_id LIKE 'seed-company-%'
       OR clerk_user_id LIKE 'seed-expert-%';
`.trim();

async function main() {
  const isRemote = process.argv.includes("--remote");
  const flag = isRemote ? "--remote" : "--local";
  const tmpFile = join(tmpdir(), `aitaskpages-cleanup-seed-${Date.now()}.sql`);
  writeFileSync(tmpFile, CLEANUP_SEED_SQL);

  const target = isRemote ? "production" : "local";
  console.log(`Removing seed demo data from ${target} D1…`);

  try {
    execSync(`npx wrangler d1 execute aitaskpages_db ${flag} --file=${tmpFile}`, {
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
