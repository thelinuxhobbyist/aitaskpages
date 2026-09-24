/**
 * Seed sample individual expert profiles for local discovery testing.
 *
 * Usage:
 *   npm run db:seed:experts:local
 */

import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

type WorkExample = {
  title: string;
  description?: string;
  url?: string;
  outcome?: string;
  industry?: string;
  role?: string;
  technologies?: string[];
};

type Capability = { title: string; description: string };

type SeedExpert = {
  clerkSuffix: string;
  email: string;
  name: string;
  slug: string;
  headline: string;
  bio: string;
  location: string;
  hourlyRate: number;
  currency: string;
  availability: "available" | "limited" | "unavailable";
  linkedinUrl: string;
  websiteUrl?: string;
  hoursAgo: number;
  skillSlugs: string[];
  serviceSlugs: string[];
  industries: string[];
  helpWith: string[];
  workExamples: WorkExample[];
  capabilities: Capability[];
  featured?: boolean;
};

const SEED_EXPERTS: SeedExpert[] = [
  {
    clerkSuffix: "maya-chen",
    email: "expert-maya@example.com",
    name: "Maya Chen",
    slug: "maya-chen",
    headline: "Voice AI and clinic call automation",
    bio: "I work with dental practices and clinics whose front desk cannot keep up with the phone. Before this I spent several years building voice and chat systems for appointment-led businesses, usually sitting with the reception lead rather than replacing them.\n\nThe work I take on is specific: a voice receptionist that books, changes and confirms appointments, answers the questions the team is tired of repeating, and writes the result into the practice system. If a caller needs a person, the call goes to a person.\n\nPractices usually find me when missed calls are turning into missed bookings. I stay through the first live weeks so the team trusts it, then they run it themselves.",
    location: "Bristol",
    hourlyRate: 140,
    currency: "GBP",
    availability: "available",
    linkedinUrl: "https://www.linkedin.com/in/example-maya-chen",
    websiteUrl: "https://example.com/maya-chen",
    hoursAgo: 4,
    skillSlugs: ["ai-agents", "nlp", "llms"],
    serviceSlugs: ["ai-integration", "chatbot-agent-development", "ai-proof-of-concept"],
    industries: ["Dental", "Healthcare"],
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
          "A voice receptionist for appointment-led businesses that books, changes and confirms visits, and passes anything unusual to the team.",
      },
      {
        title: "Call automation",
        description:
          "Takes the repetitive incoming calls off the front desk, especially overflow and after-hours, without sending patients into a dead end.",
      },
      {
        title: "Practice-system integration",
        description:
          "Writes the outcome of a call into the booking or CRM system the practice already uses, so reception is not retyping it.",
      },
    ],
    workExamples: [
      {
        title: "After-hours receptionist for a dental group",
        description:
          "A multi-site dental group was missing booking and cancellation calls once reception closed. I built a voice receptionist that handles those calls overnight and pushes a confirmed appointment into the practice system.",
        outcome:
          "The morning list is already up to date, and reception starts the day on the calls that need a person.",
        industry: "Dental",
        role: "Independent specialist",
        technologies: ["Voice AI", "Practice management software"],
        url: "https://example.com/maya-chen/dental-receptionist",
      },
    ],
    featured: true,
  },
  {
    clerkSuffix: "jonas-adebayo",
    email: "expert-jonas@example.com",
    name: "Jonas Adebayo",
    slug: "jonas-adebayo",
    headline: "Document and invoice automation for finance teams",
    bio: "I work with finance and operations teams who are still keying invoices, contracts and supplier documents by hand. Most of my background is in back-office systems for accountancy firms and in-house finance teams, not in generic chatbots.\n\nA typical piece of work is a reviewed workflow: documents come in, the routine ones are read and posted, and the exceptions land in a queue a person already owns. I am careful about what the system is allowed to do on its own.\n\nTeams come to me when the volume of documents has outgrown the people, and they want the people reviewing rather than retyping.",
    location: "London",
    hourlyRate: 160,
    currency: "GBP",
    availability: "limited",
    linkedinUrl: "https://www.linkedin.com/in/example-jonas-adebayo",
    hoursAgo: 12,
    skillSlugs: ["llms", "python", "data-engineering"],
    serviceSlugs: ["ai-integration", "ai-product-development"],
    industries: ["Financial services", "Professional services"],
    helpWith: ["Invoice automation", "Document automation", "AI productionisation"],
    capabilities: [
      {
        title: "Invoice automation",
        description:
          "Reads supplier invoices, posts the straightforward ones, and leaves a short queue of exceptions for the finance team.",
      },
      {
        title: "Document automation",
        description:
          "Turns contracts and other repeating documents into structured records, with a person checking anything ambiguous.",
      },
    ],
    workExamples: [
      {
        title: "Invoice capture for a regional accountancy firm",
        description:
          "The firm was keying supplier invoices into the ledger by hand. I built a workflow that reads the invoice, posts the clear ones, and leaves anything uncertain for a person to check.",
        outcome:
          "The team reviews exceptions instead of retyping every invoice.",
        industry: "Professional services",
        role: "Independent specialist",
        technologies: ["Document automation", "Ledger integration"],
        url: "https://example.com/jonas-adebayo/invoice-capture",
      },
    ],
  },
  {
    clerkSuffix: "priya-nair",
    email: "expert-priya@example.com",
    name: "Priya Nair",
    slug: "priya-nair",
    headline: "AI product development, from proof of concept to production",
    bio: "I help product and operations teams who have tried an AI prototype and now need something staff will actually use. I have spent the last decade taking software from a demo into day-to-day use, mostly with retail and manufacturing teams.\n\nThe pattern is usually the same. Pick one job the prototype almost does, decide how you will know it is good enough, and connect it to the tools people already open. I would rather ship a narrow assistant that staff trust than a broad one they abandon.\n\nCompanies find me when a proof of concept has impressed a leadership meeting and then stalled.",
    location: "Manchester",
    hourlyRate: 175,
    currency: "GBP",
    availability: "available",
    linkedinUrl: "https://www.linkedin.com/in/example-priya-nair",
    websiteUrl: "https://example.com/priya-nair",
    hoursAgo: 20,
    skillSlugs: ["llms", "rag-systems", "mlops", "python"],
    serviceSlugs: ["ai-product-development", "ai-proof-of-concept", "rag-implementation"],
    industries: ["Retail", "Manufacturing"],
    helpWith: ["AI product development", "AI proof of concept", "AI productionisation", "Chatbots"],
    capabilities: [
      {
        title: "AI product development",
        description:
          "Turns a promising prototype into a narrow product staff can use, with a clear owner after handover.",
      },
      {
        title: "Proof of concept to production",
        description:
          "Chooses the first use case worth keeping, tests it against real questions, and connects it to the systems the team already has.",
      },
    ],
    workExamples: [
      {
        title: "Cited answers over a retailer's policy library",
        description:
          "Store staff were searching a shared drive for policy answers. I built an assistant that answers from those documents and shows the page the answer came from.",
        outcome:
          "Staff get a sourced answer instead of opening a folder and guessing which file is current.",
        industry: "Retail",
        role: "Product engineer",
        technologies: ["Retrieval", "Internal documents"],
        url: "https://example.com/priya-nair/policy-search",
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
  const statements: string[] = ["-- Seed individual expert profiles"];

  for (const expert of SEED_EXPERTS) {
    const clerkId = `seed-expert-${expert.clerkSuffix}`;
    const createdAt = `datetime('now', '-${expert.hoursAgo} hours')`;
    const featured = expert.featured ? 1 : 0;
    const website = expert.websiteUrl
      ? `'${escapeSql(expert.websiteUrl)}'`
      : "NULL";

    statements.push(`
INSERT OR IGNORE INTO users (
  clerk_user_id, email, name, role, plan,
  marketing_opt_in, unsubscribed, created_at, updated_at
) VALUES (
  '${escapeSql(clerkId)}',
  '${escapeSql(expert.email)}',
  '${escapeSql(expert.name)}',
  'freelancer',
  'free',
  0, 0,
  ${createdAt},
  ${createdAt}
);

INSERT OR IGNORE INTO freelancer_profiles (
  user_id, slug, full_name, profile_type, headline, bio, location,
  hourly_rate, hourly_rate_currency, availability,
  linkedin_url, website_url, status, featured,
  industries, help_with, work_examples, capabilities, created_at, updated_at
)
SELECT
  u.id,
  '${escapeSql(expert.slug)}',
  '${escapeSql(expert.name)}',
  'individual',
  '${escapeSql(expert.headline)}',
  '${escapeSql(expert.bio)}',
  '${escapeSql(expert.location)}',
  ${expert.hourlyRate},
  '${escapeSql(expert.currency)}',
  '${escapeSql(expert.availability)}',
  '${escapeSql(expert.linkedinUrl)}',
  ${website},
  'approved',
  ${featured},
  ${jsonOrNull(expert.industries)},
  ${jsonOrNull(expert.helpWith)},
  ${jsonOrNull(expert.workExamples)},
  ${jsonOrNull(expert.capabilities)},
  ${createdAt},
  ${createdAt}
FROM users u
WHERE u.clerk_user_id = '${escapeSql(clerkId)}'
  AND NOT EXISTS (
    SELECT 1 FROM freelancer_profiles p WHERE p.slug = '${escapeSql(expert.slug)}'
  );

UPDATE freelancer_profiles
SET
  profile_type = 'individual',
  headline = '${escapeSql(expert.headline)}',
  bio = '${escapeSql(expert.bio)}',
  location = '${escapeSql(expert.location)}',
  hourly_rate = ${expert.hourlyRate},
  hourly_rate_currency = '${escapeSql(expert.currency)}',
  availability = '${escapeSql(expert.availability)}',
  linkedin_url = '${escapeSql(expert.linkedinUrl)}',
  website_url = ${website},
  status = 'approved',
  featured = ${featured},
  industries = ${jsonOrNull(expert.industries)},
  help_with = ${jsonOrNull(expert.helpWith)},
  work_examples = ${jsonOrNull(expert.workExamples)},
  capabilities = ${jsonOrNull(expert.capabilities)}
WHERE slug = '${escapeSql(expert.slug)}';
`);

    for (const skillSlug of expert.skillSlugs) {
      statements.push(`
INSERT OR IGNORE INTO freelancer_skills (freelancer_id, skill_id)
SELECT p.id, s.id
FROM freelancer_profiles p
JOIN skills s ON s.slug = '${escapeSql(skillSlug)}'
WHERE p.slug = '${escapeSql(expert.slug)}';
`);
    }

    for (const serviceSlug of expert.serviceSlugs) {
      statements.push(`
INSERT OR IGNORE INTO freelancer_services (freelancer_id, service_id)
SELECT p.id, svc.id
FROM freelancer_profiles p
JOIN services svc ON svc.slug = '${escapeSql(serviceSlug)}'
WHERE p.slug = '${escapeSql(expert.slug)}';
`);
    }
  }

  return statements.join("\n");
}

async function main() {
  const isRemote = process.argv.includes("--remote");
  const flag = isRemote ? "--remote" : "--local";
  const tmpFile = join(tmpdir(), `aitaskpages-seed-experts-${Date.now()}.sql`);
  writeFileSync(tmpFile, buildSql());

  console.log(
    `Seeding ${SEED_EXPERTS.length} expert profiles ${isRemote ? "remotely" : "locally"}…`
  );

  try {
    execSync(`npx wrangler d1 execute aitaskpages_db ${flag} --file=${tmpFile}`, {
      stdio: "inherit",
    });
    console.log("Expert seed complete.");
  } finally {
    unlinkSync(tmpFile);
  }
}

main().catch((err) => {
  console.error("Expert seed failed:", err);
  process.exit(1);
});
