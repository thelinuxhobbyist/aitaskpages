/**
 * Seed sample company profiles for local discovery testing.
 *
 * Usage:
 *   npm run db:seed:companies:local
 *   npm run db:seed:companies:remote   (avoid on production unless intentional)
 *
 * Requires skills/services seed and migration 0010 (profile_type).
 */

import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

type SeedCompany = {
  clerkSuffix: string;
  email: string;
  name: string;
  slug: string;
  headline: string;
  bio: string;
  location: string;
  websiteUrl: string;
  linkedinUrl?: string;
  companySize?: string;
  yearEstablished?: number;
  externalLinks?: string[];
  featured?: boolean;
  hoursAgo: number;
  skillSlugs: string[];
  serviceSlugs: string[];
  customSkills?: string[];
  customServices?: string[];
};

const SEED_COMPANIES: SeedCompany[] = [
  {
    clerkSuffix: "acme-ai",
    email: "company-acme@example.com",
    name: "Acme AI",
    slug: "acme-ai",
    headline: "AI Consultancy & Automation",
    bio: "We help UK SMEs design and ship practical AI automations — from workflow bots to internal copilots — with clear ownership after handover.",
    location: "London",
    websiteUrl: "https://example.com/acme-ai",
    linkedinUrl: "https://www.linkedin.com/company/example-acme-ai",
    companySize: "11-50",
    yearEstablished: 2020,
    externalLinks: ["https://example.com/acme-ai/case-studies"],
    featured: true,
    hoursAgo: 2,
    skillSlugs: ["llms", "ai-agents", "prompt-engineering"],
    serviceSlugs: ["ai-strategy-consulting", "ai-integration", "chatbot-agent-development"],
    customServices: ["Microsoft Copilot rollout"],
  },
  {
    clerkSuffix: "northstar-labs",
    email: "company-northstar@example.com",
    name: "Northstar Labs",
    slug: "northstar-labs",
    headline: "LLM product studio for B2B teams",
    bio: "A product engineering team focused on RAG assistants, agent workflows and evaluation harnesses for regulated UK businesses.",
    location: "Manchester",
    websiteUrl: "https://example.com/northstar-labs",
    companySize: "11-50",
    yearEstablished: 2018,
    externalLinks: ["https://github.com/example/northstar-labs"],
    hoursAgo: 6,
    skillSlugs: ["rag-systems", "llms", "python"],
    serviceSlugs: ["rag-implementation", "ai-product-development", "llm-fine-tuning"],
    customSkills: ["LangGraph", "Evaluation harnesses"],
  },
  {
    clerkSuffix: "brightline-ml",
    email: "company-brightline@example.com",
    name: "Brightline ML",
    slug: "brightline-ml",
    headline: "Machine learning & MLOps delivery team",
    bio: "We build, deploy and monitor production ML systems — forecasting, classification and recommendation — with CI/CD and observability baked in.",
    location: "Bristol",
    websiteUrl: "https://example.com/brightline-ml",
    companySize: "51-200",
    yearEstablished: 2016,
    hoursAgo: 12,
    skillSlugs: ["machine-learning", "mlops", "data-engineering"],
    serviceSlugs: ["ml-model-development", "mlops-model-deployment", "data-pipeline-development"],
    customSkills: ["Kubernetes", "Feature stores"],
  },
  {
    clerkSuffix: "harbour-vision",
    email: "company-harbour@example.com",
    name: "Harbour Vision",
    slug: "harbour-vision",
    headline: "Computer vision for operations & quality",
    bio: "Specialist computer vision consultancy for inspection, tracking and safety use cases on factory floors and logistics sites across the UK.",
    location: "Birmingham",
    websiteUrl: "https://example.com/harbour-vision",
    companySize: "11-50",
    yearEstablished: 2021,
    hoursAgo: 18,
    skillSlugs: ["computer-vision", "deep-learning", "python"],
    serviceSlugs: ["computer-vision-solutions", "ai-proof-of-concept"],
    customServices: ["On-site camera pilots"],
  },
  {
    clerkSuffix: "oakdale-ai",
    email: "company-oakdale@example.com",
    name: "Oakdale AI Partners",
    slug: "oakdale-ai-partners",
    headline: "AI strategy, training & adoption",
    bio: "We partner with leadership teams on AI roadmaps, governance and hands-on workshops so staff can adopt tools safely and measurably.",
    location: "Leeds",
    websiteUrl: "https://example.com/oakdale-ai",
    companySize: "1-10",
    yearEstablished: 2019,
    externalLinks: ["https://example.com/oakdale-ai/workshops"],
    hoursAgo: 28,
    skillSlugs: ["generative-ai", "prompt-engineering", "ai-ethics-governance"],
    serviceSlugs: ["ai-strategy-consulting", "ai-training-workshops", "ai-audit-assessment"],
  },
  {
    clerkSuffix: "riverbank-agents",
    email: "company-riverbank@example.com",
    name: "Riverbank Agents",
    slug: "riverbank-agents",
    headline: "AI agent & chatbot engineering",
    bio: "A delivery team that designs conversational and multi-agent systems for customer support, internal ops and knowledge workflows.",
    location: "Edinburgh",
    websiteUrl: "https://example.com/riverbank-agents",
    companySize: "11-50",
    yearEstablished: 2022,
    externalLinks: ["https://example.com/riverbank-agents/voice-agents"],
    featured: true,
    hoursAgo: 40,
    skillSlugs: ["ai-agents", "nlp", "cloud-ai"],
    serviceSlugs: ["chatbot-agent-development", "ai-integration", "nlp-solutions"],
    customSkills: ["Voice agents"],
  },
];

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function jsonOrNull(values: string[] | undefined): string {
  if (!values || values.length === 0) return "NULL";
  return `'${escapeSql(JSON.stringify(values))}'`;
}

function buildSql(): string {
  const statements: string[] = [
    "-- Seed company profiles (idempotent by clerk_user_id / slug)",
  ];

  for (const company of SEED_COMPANIES) {
    const clerkId = `seed-company-${company.clerkSuffix}`;
    const createdAt = `datetime('now', '-${company.hoursAgo} hours')`;
    const featured = company.featured ? 1 : 0;
    const linkedin = company.linkedinUrl
      ? `'${escapeSql(company.linkedinUrl)}'`
      : "NULL";
    const companySize = company.companySize
      ? `'${escapeSql(company.companySize)}'`
      : "NULL";
    const yearEstablished =
      company.yearEstablished != null ? String(company.yearEstablished) : "NULL";

    statements.push(`
INSERT OR IGNORE INTO users (
  clerk_user_id, email, name, role, plan,
  marketing_opt_in, unsubscribed, created_at, updated_at
) VALUES (
  '${escapeSql(clerkId)}',
  '${escapeSql(company.email)}',
  '${escapeSql(company.name)}',
  'freelancer',
  'free',
  0,
  0,
  ${createdAt},
  ${createdAt}
);

INSERT OR IGNORE INTO freelancer_profiles (
  user_id, slug, full_name, profile_type, headline, bio, location,
  hourly_rate, availability, company_size, year_established,
  linkedin_url, github_url, website_url, external_links,
  profile_image_url, profile_views, status, featured,
  custom_skills, custom_services, created_at, updated_at
)
SELECT
  u.id,
  '${escapeSql(company.slug)}',
  '${escapeSql(company.name)}',
  'company',
  '${escapeSql(company.headline)}',
  '${escapeSql(company.bio)}',
  '${escapeSql(company.location)}',
  NULL,
  NULL,
  ${companySize},
  ${yearEstablished},
  ${linkedin},
  NULL,
  '${escapeSql(company.websiteUrl)}',
  ${jsonOrNull(company.externalLinks)},
  NULL,
  0,
  'approved',
  ${featured},
  ${jsonOrNull(company.customSkills)},
  ${jsonOrNull(company.customServices)},
  ${createdAt},
  ${createdAt}
FROM users u
WHERE u.clerk_user_id = '${escapeSql(clerkId)}'
  AND NOT EXISTS (
    SELECT 1 FROM freelancer_profiles p WHERE p.slug = '${escapeSql(company.slug)}'
  );

UPDATE freelancer_profiles
SET
  full_name = '${escapeSql(company.name)}',
  profile_type = 'company',
  headline = '${escapeSql(company.headline)}',
  bio = '${escapeSql(company.bio)}',
  location = '${escapeSql(company.location)}',
  hourly_rate = NULL,
  availability = NULL,
  company_size = ${companySize},
  year_established = ${yearEstablished},
  linkedin_url = ${linkedin},
  github_url = NULL,
  website_url = '${escapeSql(company.websiteUrl)}',
  external_links = ${jsonOrNull(company.externalLinks)},
  status = 'approved',
  featured = ${featured},
  custom_skills = ${jsonOrNull(company.customSkills)},
  custom_services = ${jsonOrNull(company.customServices)}
WHERE slug = '${escapeSql(company.slug)}';
`);

    for (const skillSlug of company.skillSlugs) {
      statements.push(`
INSERT OR IGNORE INTO freelancer_skills (freelancer_id, skill_id)
SELECT p.id, s.id
FROM freelancer_profiles p
JOIN skills s ON s.slug = '${escapeSql(skillSlug)}'
WHERE p.slug = '${escapeSql(company.slug)}';
`);
    }

    for (const serviceSlug of company.serviceSlugs) {
      statements.push(`
INSERT OR IGNORE INTO freelancer_services (freelancer_id, service_id)
SELECT p.id, svc.id
FROM freelancer_profiles p
JOIN services svc ON svc.slug = '${escapeSql(serviceSlug)}'
WHERE p.slug = '${escapeSql(company.slug)}';
`);
    }
  }

  return statements.join("\n");
}

async function main() {
  const isRemote = process.argv.includes("--remote");
  const flag = isRemote ? "--remote" : "--local";
  const sql = buildSql();
  const tmpFile = join(tmpdir(), `aijobsmarket-seed-companies-${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);

  console.log(
    `Seeding ${SEED_COMPANIES.length} company profiles ${isRemote ? "remotely" : "locally"}…`
  );

  try {
    execSync(`npx wrangler d1 execute aijobsmarket_db ${flag} --file=${tmpFile}`, {
      stdio: "inherit",
    });
    console.log("Company seed complete.");
  } finally {
    unlinkSync(tmpFile);
  }
}

main().catch((err) => {
  console.error("Company seed failed:", err);
  process.exit(1);
});
