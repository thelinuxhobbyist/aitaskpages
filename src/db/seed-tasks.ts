/**
 * Seed sample open tasks for local layout testing.
 *
 * Usage:
 *   npm run db:seed:tasks:local
 *   npm run db:seed:tasks:remote   (avoid on production unless intentional)
 *
 * Requires skills/services seed and migrations through 0006+.
 */

import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const DEMO_CLERK_ID = "seed-demo-client";

type SeedTask = {
  title: string;
  description: string;
  companyName: string;
  budget: string;
  location: string;
  remoteOk: boolean;
  hoursAgo: number;
  skillSlugs: string[];
  serviceSlugs: string[];
  industry?: string;
  problem?: string;
  timeline?: string;
  technologies?: string[];
};

const SEED_TASKS: SeedTask[] = [
  {
    title: "AI receptionist / call automation for dental surgery",
    description:
      "We're a dental surgery experiencing a high volume of calls. We need help automating call handling and reducing the workload on our team.\n\nPatients ring to book, change, and confirm appointments. Reception is missing calls at busy times, and the team is spending too long on routine questions.\n\nWe want someone who has done this kind of work before, ideally with a practice-management or CRM integration. We are not looking to hand over project management — we want to talk to the right people and decide together.",
    companyName: "Harbour Lane Dental",
    budget: "8000",
    location: "Bristol",
    remoteOk: true,
    hoursAgo: 1,
    skillSlugs: ["ai-agents", "nlp", "llms"],
    serviceSlugs: ["chatbot-agent-development", "ai-integration"],
    industry: "Dental / Healthcare",
    problem:
      "High volume of incoming calls. Reception is missing bookings and spending too long on routine appointment questions.",
    timeline: "Pilot in the next 6–8 weeks",
    technologies: ["Twilio", "Practice management software", "CRM"],
  },
  {
    title: "ML engineer for customer support chatbot",
    description:
      "We need an ML engineer to build a customer support chatbot for our website, integrate it with our help desk, and improve response quality over time.",
    companyName: "Northbridge Retail",
    budget: "3500",
    location: "Manchester",
    remoteOk: true,
    hoursAgo: 3,
    skillSlugs: ["machine-learning", "nlp", "python"],
    serviceSlugs: ["chatbot-agent-development"],
    industry: "Retail",
    problem: "Support tickets are repetitive and slow to answer from the website help desk.",
    timeline: "First version this quarter",
    technologies: ["Zendesk", "Website chat"],
  },
  {
    title: "Copilot rollout for legal team",
    description:
      "Looking for someone to help our solicitors adopt Microsoft Copilot safely, including prompt templates, governance, and a short training session.",
    companyName: "Harper & Lane LLP",
    budget: "2200",
    location: "Leeds",
    remoteOk: false,
    hoursAgo: 8,
    skillSlugs: ["llms", "prompt-engineering"],
    serviceSlugs: ["ai-training-workshops", "ai-strategy-consulting"],
  },
  {
    title: "Computer vision quality inspection pilot",
    description:
      "Manufacturing SME wants a proof of concept to detect defects on our production line using camera feeds and a lightweight vision model.",
    companyName: "Precision Parts Co.",
    budget: "5000",
    location: "Birmingham",
    remoteOk: false,
    hoursAgo: 14,
    skillSlugs: ["computer-vision", "python", "pytorch"],
    serviceSlugs: ["computer-vision-solutions", "ai-proof-of-concept"],
  },
  {
    title: "RAG search over internal documents",
    description:
      "We have thousands of PDFs and Notion pages. Need a RAG pipeline so staff can ask questions and get cited answers from our own content.",
    companyName: "Summit Analytics",
    budget: "4200",
    location: "London",
    remoteOk: true,
    hoursAgo: 22,
    skillSlugs: ["rag-systems", "llms", "python"],
    serviceSlugs: ["rag-implementation"],
  },
  {
    title: "Forecasting model for inventory planning",
    description:
      "Help us build a time series forecasting model for seasonal inventory. We use Shopify and want something we can rerun monthly.",
    companyName: "Coastal Goods",
    budget: "2800",
    location: "Bristol",
    remoteOk: true,
    hoursAgo: 30,
    skillSlugs: ["time-series-forecasting", "data-science", "python"],
    serviceSlugs: ["predictive-analytics", "ml-model-development"],
  },
  {
    title: "AI audit before board presentation",
    description:
      "Board wants an independent view of our AI experiments. Need a short audit covering data use, model risks, and practical next steps.",
    companyName: "Finwell Group",
    budget: "1800",
    location: "Edinburgh",
    remoteOk: true,
    hoursAgo: 40,
    skillSlugs: ["ai-ethics-governance", "generative-ai"],
    serviceSlugs: ["ai-audit-assessment"],
  },
];

function sqlText(value: string | undefined): string {
  if (!value?.trim()) return "NULL";
  return `'${escapeSql(value.trim())}'`;
}

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function buildTaskSeedSql(): string {
  const statements: string[] = [
    `INSERT OR IGNORE INTO users (clerk_user_id, email, name, role, plan, marketing_opt_in, unsubscribed, created_at, updated_at)
     VALUES ('${DEMO_CLERK_ID}', 'demo-tasks@aitaskpages.test', 'Demo Tasks Client', 'freelancer', 'free', 0, 0, datetime('now'), datetime('now'));`,
  ];

  for (const task of SEED_TASKS) {
    const remote = task.remoteOk ? 1 : 0;
    statements.push(`
INSERT INTO requirements (
  client_user_id, title, description, company_name, budget, location,
  status, business_type, remote_ok, created_at, updated_at
)
SELECT
  u.id,
  '${escapeSql(task.title)}',
  '${escapeSql(task.description)}',
  '${escapeSql(task.companyName)}',
  '${escapeSql(task.budget)}',
  '${escapeSql(task.location)}',
  'open',
  'sme',
  ${remote},
  datetime('now', '-${task.hoursAgo} hours'),
  datetime('now', '-${task.hoursAgo} hours')
FROM users u
WHERE u.clerk_user_id = '${DEMO_CLERK_ID}'
  AND NOT EXISTS (
    SELECT 1 FROM requirements r
    WHERE r.client_user_id = u.id AND r.title = '${escapeSql(task.title)}'
  );`);

    for (const slug of task.skillSlugs) {
      statements.push(`
INSERT INTO requirement_skills (requirement_id, skill_id)
SELECT r.id, s.id
FROM requirements r
JOIN users u ON u.id = r.client_user_id
JOIN skills s ON s.slug = '${escapeSql(slug)}'
WHERE u.clerk_user_id = '${DEMO_CLERK_ID}'
  AND r.title = '${escapeSql(task.title)}'
  AND NOT EXISTS (
    SELECT 1 FROM requirement_skills rs
    WHERE rs.requirement_id = r.id AND rs.skill_id = s.id
  );`);
    }

    for (const slug of task.serviceSlugs) {
      statements.push(`
INSERT INTO requirement_services (requirement_id, service_id)
SELECT r.id, s.id
FROM requirements r
JOIN users u ON u.id = r.client_user_id
JOIN services s ON s.slug = '${escapeSql(slug)}'
WHERE u.clerk_user_id = '${DEMO_CLERK_ID}'
  AND r.title = '${escapeSql(task.title)}'
  AND NOT EXISTS (
    SELECT 1 FROM requirement_services rs
    WHERE rs.requirement_id = r.id AND rs.service_id = s.id
  );`);
    }

    statements.push(`
UPDATE requirements
SET
  industry = ${sqlText(task.industry)},
  problem = ${sqlText(task.problem)},
  timeline = ${sqlText(task.timeline)},
  technologies = ${task.technologies?.length ? `'${escapeSql(JSON.stringify(task.technologies))}'` : "NULL"}
WHERE title = '${escapeSql(task.title)}'
  AND client_user_id = (
    SELECT id FROM users WHERE clerk_user_id = '${DEMO_CLERK_ID}'
  );`);
  }

  return statements.join("\n");
}

async function main() {
  const isRemote = process.argv.includes("--remote");
  const flag = isRemote ? "--remote" : "--local";
  const sql = buildTaskSeedSql();
  const tmpFile = join(tmpdir(), `aitaskpages-seed-tasks-${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);

  console.log(
    `Seeding ${SEED_TASKS.length} sample tasks ${isRemote ? "remotely" : "locally"}…`
  );

  try {
    execSync(`npx wrangler d1 execute aitaskpages_db ${flag} --file=${tmpFile}`, {
      stdio: "inherit",
    });
    console.log("Task seed complete.");
  } finally {
    unlinkSync(tmpFile);
  }
}

if (process.argv[1]?.includes("seed-tasks")) {
  main().catch((err) => {
    console.error("Task seed failed:", err);
    process.exit(1);
  });
}

export { SEED_TASKS, DEMO_CLERK_ID };
