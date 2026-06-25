/**
 * Seed skills and services lookup tables.
 *
 * Usage:
 *   npm run db:seed:local    — seed local D1 (after migrations)
 *   npm run db:seed:remote   — seed production D1
 */

import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const SEED_SKILLS = [
  { name: "Machine Learning", slug: "machine-learning" },
  { name: "Deep Learning", slug: "deep-learning" },
  { name: "Natural Language Processing", slug: "nlp" },
  { name: "Large Language Models", slug: "llms" },
  { name: "Computer Vision", slug: "computer-vision" },
  { name: "MLOps", slug: "mlops" },
  { name: "Data Engineering", slug: "data-engineering" },
  { name: "Python", slug: "python" },
  { name: "PyTorch", slug: "pytorch" },
  { name: "TensorFlow", slug: "tensorflow" },
  { name: "Generative AI", slug: "generative-ai" },
  { name: "Prompt Engineering", slug: "prompt-engineering" },
  { name: "RAG Systems", slug: "rag-systems" },
  { name: "AI Agents", slug: "ai-agents" },
  { name: "Reinforcement Learning", slug: "reinforcement-learning" },
  { name: "Time Series Forecasting", slug: "time-series-forecasting" },
  { name: "Data Science", slug: "data-science" },
  { name: "Cloud AI (AWS/GCP/Azure)", slug: "cloud-ai" },
  { name: "Edge AI", slug: "edge-ai" },
  { name: "AI Ethics & Governance", slug: "ai-ethics-governance" },
];

const SEED_SERVICES = [
  { name: "AI Strategy Consulting", slug: "ai-strategy-consulting" },
  { name: "ML Model Development", slug: "ml-model-development" },
  { name: "LLM Fine-tuning", slug: "llm-fine-tuning" },
  { name: "Chatbot & Agent Development", slug: "chatbot-agent-development" },
  { name: "NLP Solutions", slug: "nlp-solutions" },
  { name: "Computer Vision Solutions", slug: "computer-vision-solutions" },
  { name: "Data Pipeline Development", slug: "data-pipeline-development" },
  { name: "MLOps & Model Deployment", slug: "mlops-model-deployment" },
  { name: "AI Product Development", slug: "ai-product-development" },
  { name: "AI Proof of Concept", slug: "ai-proof-of-concept" },
  { name: "AI Training & Workshops", slug: "ai-training-workshops" },
  { name: "AI Audit & Assessment", slug: "ai-audit-assessment" },
  { name: "RAG Implementation", slug: "rag-implementation" },
  { name: "AI Integration", slug: "ai-integration" },
  { name: "Predictive Analytics", slug: "predictive-analytics" },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function buildInsertStatements(): string {
  const statements: string[] = [];

  for (const skill of SEED_SKILLS) {
    statements.push(
      `INSERT OR IGNORE INTO skills (name, slug) VALUES ('${escapeSql(skill.name)}', '${escapeSql(skill.slug)}');`
    );
  }

  for (const service of SEED_SERVICES) {
    statements.push(
      `INSERT OR IGNORE INTO services (name, slug) VALUES ('${escapeSql(service.name)}', '${escapeSql(service.slug)}');`
    );
  }

  return statements.join("\n");
}

async function main() {
  const isRemote = process.argv.includes("--remote");
  const flag = isRemote ? "--remote" : "--local";
  const sql = buildInsertStatements();
  const tmpFile = join(tmpdir(), `aijobsmarket-seed-${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);

  console.log(`Seeding skills (${SEED_SKILLS.length}) and services (${SEED_SERVICES.length}) ${isRemote ? "remotely" : "locally"}…`);

  try {
    execSync(`npx wrangler d1 execute aijobsmarket_db ${flag} --file=${tmpFile}`, {
      stdio: "inherit",
    });
    console.log("Seed complete.");
  } finally {
    unlinkSync(tmpFile);
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

// Re-export for programmatic use in tests / future scripts
export { SEED_SKILLS, SEED_SERVICES, slugify };
