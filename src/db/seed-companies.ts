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
  industries?: string[];
  helpWith?: string[];
  workExamples?: {
    title: string;
    description?: string;
    url?: string;
    outcome?: string;
    industry?: string;
    role?: string;
    technologies?: string[];
  }[];
  capabilities?: { title: string; description: string }[];
};

const SEED_COMPANIES: SeedCompany[] = [
  {
    clerkSuffix: "acme-ai",
    email: "company-acme@example.com",
    name: "Acme AI",
    slug: "acme-ai",
    headline: "AI Consultancy & Automation",
    bio: "Acme AI is a London consultancy that helps established businesses put AI to work in operations they already run. The team is a mix of consultants and engineers. Clients are usually professional-services firms and finance teams who know the problem, and want a practical way to address it.\n\nMost of the work starts with a specific bottleneck: people searching across too many documents, repeating the same process, or unsure where AI would actually save time. We map that with the people who do the work, then build a narrow first version they can try with real staff.\n\nWe stay through the first weeks of use, then hand the system over. We do not run the client's project, contract, or delivery after that introduction turns into a working arrangement.",
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
    industries: ["Professional services", "Financial services"],
    helpWith: ["AI strategy", "Document automation", "CRM automation"],
    capabilities: [
      {
        title: "AI strategy and consulting",
        description:
          "Help businesses identify practical AI opportunities, develop an implementation roadmap and decide where AI can create measurable value.",
      },
      {
        title: "AI automation",
        description:
          "Design and implement workflows that remove repetitive manual work across customer operations, finance and internal processes.",
      },
      {
        title: "AI agents",
        description:
          "Build AI agents that can handle defined tasks, interact with business systems and hand work to people when required.",
      },
    ],
    workExamples: [
      {
        title: "Internal AI copilot for a professional-services firm",
        description:
          "Built an internal assistant that allows employees to search and work with company documents and knowledge. The system was designed so employees could find relevant information without manually searching across multiple sources.",
        outcome:
          "Staff now ask a question and get an answer with the source document, instead of searching shared drives.",
        industry: "Professional services",
        role: "Delivery partner",
        technologies: ["Large language models", "Document search"],
        url: "https://example.com/acme-ai/case-studies",
      },
      {
        title: "Invoice intake for a finance team",
        description:
          "A finance team was still retyping supplier invoices. We built a workflow that reads the invoice, posts the straightforward ones, and leaves anything uncertain for a person to check.",
        outcome:
          "The team reviews exceptions instead of keying every invoice by hand.",
        industry: "Financial services",
        role: "Delivery partner",
        technologies: ["Document automation", "Ledger"],
        url: "https://example.com/acme-ai/invoice-intake",
      },
    ],
  },
  {
    clerkSuffix: "northstar-labs",
    email: "company-northstar@example.com",
    name: "Northstar Labs",
    slug: "northstar-labs",
    headline: "LLM product studio for B2B teams",
    bio: "A product engineering team focused on RAG assistants, agent workflows and evaluation harnesses for regulated businesses.",
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
    bio: "Specialist computer vision consultancy for inspection, tracking and safety use cases on factory floors and logistics sites.",
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
    bio: "Riverbank Agents designs conversational systems for businesses that live on the phone or in a support inbox. The team is based in Edinburgh and works with clinics, hospitality groups and operations teams whose staff spend the day answering the same questions.\n\nA typical engagement is a defined job for an agent: take the booking, answer from the company's own information, and hand the conversation to a person when it leaves that script. We are not a call-centre platform. We introduce the approach, build the first version with the client's systems, and leave them able to run it.",
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
    industries: ["Healthcare", "Dental", "Hospitality"],
    helpWith: [
      "Voice AI",
      "AI receptionists",
      "Call automation",
      "Appointment automation",
      "CRM automation",
    ],
    capabilities: [
      {
        title: "AI receptionists",
        description:
          "Voice and chat receptionists that book, change and confirm appointments, then pass anything unusual to a person.",
      },
      {
        title: "Customer support agents",
        description:
          "Agents that answer routine customer questions from the company's own knowledge, and hand off when the request needs a colleague.",
      },
    ],
    workExamples: [
      {
        title: "Voice receptionist for a multi-site clinic",
        description:
          "The clinic was missing calls after hours and at the busiest points in the day. We built a voice receptionist that books, changes and confirms appointments, then writes the outcome into the system the reception team already uses.",
        outcome:
          "Routine booking calls are handled without adding headcount, and staff only see the calls that need a person.",
        industry: "Healthcare",
        role: "Design and build",
        technologies: ["Voice AI", "CRM"],
        url: "https://example.com/riverbank-agents/voice-agents",
      },
    ],
  },
];

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function jsonOrNull(values: unknown[] | undefined): string {
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
  custom_skills, custom_services, industries, help_with, work_examples,
  capabilities,
  created_at, updated_at
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
  ${jsonOrNull(company.industries)},
  ${jsonOrNull(company.helpWith)},
  ${jsonOrNull(company.workExamples)},
  ${jsonOrNull(company.capabilities)},
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
  custom_services = ${jsonOrNull(company.customServices)},
  industries = ${jsonOrNull(company.industries)},
  help_with = ${jsonOrNull(company.helpWith)},
  work_examples = ${jsonOrNull(company.workExamples)},
  capabilities = ${jsonOrNull(company.capabilities)}
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
  const tmpFile = join(tmpdir(), `aitaskpages-seed-companies-${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);

  console.log(
    `Seeding ${SEED_COMPANIES.length} company profiles ${isRemote ? "remotely" : "locally"}…`
  );

  try {
    execSync(`npx wrangler d1 execute aitaskpages_db ${flag} --file=${tmpFile}`, {
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
