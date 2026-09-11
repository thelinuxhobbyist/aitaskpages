export type CatalogTerm = {
  id: number;
  name: string;
  slug: string;
};

export const MAX_TASK_SKILLS = 10;
export const MAX_TASK_SERVICES = 10;
export const MAX_PROFILE_SKILLS = 20;
export const MAX_PROFILE_SERVICES = 15;
export const MAX_SKILL_TAG_LENGTH = 50;
export const MAX_SERVICE_TAG_LENGTH = 80;

export type KeywordMap = ReadonlyArray<readonly [string, readonly string[]]>;

/** Phrases in a user's wording → skill catalog slugs. Longer phrases first. */
export const SKILL_KEYWORDS: KeywordMap = [
  ["large language model", ["llms"]],
  ["computer vision", ["computer-vision"]],
  ["natural language", ["nlp"]],
  ["machine learning", ["machine-learning"]],
  ["deep learning", ["deep-learning"]],
  ["prompt engineering", ["prompt-engineering"]],
  ["data engineering", ["data-engineering"]],
  ["data science", ["data-science"]],
  ["time series", ["time-series-forecasting"]],
  ["reinforcement learning", ["reinforcement-learning"]],
  ["generative ai", ["generative-ai"]],
  ["ai agent", ["ai-agents"]],
  ["ai ethics", ["ai-ethics-governance"]],
  ["edge ai", ["edge-ai"]],
  ["chatgpt", ["llms", "generative-ai"]],
  ["openai", ["llms", "generative-ai"]],
  ["claude", ["llms", "generative-ai"]],
  ["gemini", ["llms", "generative-ai"]],
  ["copilot", ["llms", "generative-ai", "prompt-engineering"]],
  ["langchain", ["ai-agents", "llms", "python"]],
  ["langgraph", ["ai-agents", "python"]],
  ["fine tun", ["llms"]],
  ["pytorch", ["pytorch"]],
  ["tensorflow", ["tensorflow"]],
  ["python", ["python"]],
  ["mlops", ["mlops"]],
  ["prompt", ["prompt-engineering"]],
  ["forecast", ["time-series-forecasting"]],
  ["governance", ["ai-ethics-governance"]],
  ["ethics", ["ai-ethics-governance"]],
  ["vision", ["computer-vision"]],
  ["agent", ["ai-agents"]],
  ["azure", ["cloud-ai"]],
  ["openai gpt", ["llms"]],
  ["llm", ["llms"]],
  ["gpt", ["llms", "generative-ai"]],
  ["rag", ["rag-systems"]],
  ["nlp", ["nlp"]],
  ["ocr", ["computer-vision"]],
  ["aws", ["cloud-ai"]],
  ["gcp", ["cloud-ai"]],
];

/** Phrases in a user's wording → service catalog slugs. Longer phrases first. */
export const SERVICE_KEYWORDS: KeywordMap = [
  ["chatgpt integration", ["ai-integration", "chatbot-agent-development"]],
  ["internal chatbot", ["chatbot-agent-development"]],
  ["customer support", ["chatbot-agent-development"]],
  ["proof of concept", ["ai-proof-of-concept"]],
  ["computer vision", ["computer-vision-solutions"]],
  ["model development", ["ml-model-development"]],
  ["strategy consulting", ["ai-strategy-consulting"]],
  ["ai strategy", ["ai-strategy-consulting"]],
  ["ai integration", ["ai-integration"]],
  ["ai audit", ["ai-audit-assessment"]],
  ["fine tun", ["llm-fine-tuning"]],
  ["chatbot", ["chatbot-agent-development"]],
  ["workshop", ["ai-training-workshops"]],
  ["training", ["ai-training-workshops"]],
  ["strategy", ["ai-strategy-consulting"]],
  ["integrat", ["ai-integration"]],
  ["automat", ["ai-integration"]],
  ["connect", ["ai-integration"]],
  ["pipeline", ["data-pipeline-development"]],
  ["deploy", ["mlops-model-deployment"]],
  ["mlops", ["mlops-model-deployment"]],
  ["assess", ["ai-audit-assessment"]],
  ["review", ["ai-audit-assessment", "ai-strategy-consulting"]],
  ["audit", ["ai-audit-assessment"]],
  ["forecast", ["predictive-analytics"]],
  ["predict", ["predictive-analytics"]],
  ["ai product", ["ai-product-development"]],
  ["vision", ["computer-vision-solutions"]],
  ["agent", ["chatbot-agent-development"]],
  ["pilot", ["ai-proof-of-concept"]],
  ["crm", ["ai-integration"]],
  ["rag", ["rag-implementation"]],
  ["nlp", ["nlp-solutions"]],
  ["poc", ["ai-proof-of-concept"]],
  ["llm", ["llm-fine-tuning"]],
];

export function normalizeTerm(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeFreeTextTags(
  values: string[],
  maxItems: number,
  maxLength: number
): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const raw of values) {
    const name = raw.trim().replace(/\s+/g, " ");
    if (name.length < 2 || name.length > maxLength) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(name);
    if (normalized.length >= maxItems) break;
  }

  return normalized;
}

function includesPhrase(haystack: string, phrase: string): boolean {
  if (` ${haystack} `.includes(` ${phrase} `)) return true;
  // Allow stems such as "integrat" → "integration" without matching inside other words.
  if (phrase.includes(" ") || phrase.length < 5) return false;
  return new RegExp(`(?:^| )${phrase}`).test(haystack);
}

function catalogKey(item: CatalogTerm): string {
  return normalizeTerm(item.name);
}

/** Prefer the catalog's canonical name when the user typed an exact match. */
export function canonicalCatalogName(
  value: string,
  catalog: CatalogTerm[]
): string {
  const normalized = normalizeTerm(value);
  if (!normalized) return value.trim().replace(/\s+/g, " ");
  const match = catalog.find(
    (item) =>
      catalogKey(item) === normalized ||
      item.slug.replace(/-/g, " ") === normalized
  );
  return match?.name ?? value.trim().replace(/\s+/g, " ");
}

export function mapTermsToCatalog(
  terms: string[],
  catalog: CatalogTerm[],
  keywords: KeywordMap
): CatalogTerm[] {
  const bySlug = new Map(catalog.map((item) => [item.slug, item]));
  const matched = new Map<number, CatalogTerm>();

  const add = (item: CatalogTerm | undefined) => {
    if (item) matched.set(item.id, item);
  };

  for (const term of terms) {
    const normalized = normalizeTerm(term);
    if (!normalized) continue;

    for (const item of catalog) {
      const itemNorm = catalogKey(item);
      const slugNorm = item.slug.replace(/-/g, " ");
      if (itemNorm === normalized || slugNorm === normalized) {
        add(item);
        continue;
      }
      if (itemNorm.length >= 3 && normalized.includes(itemNorm)) {
        add(item);
      } else if (normalized.length >= 3 && itemNorm.includes(normalized)) {
        add(item);
      }
    }

    for (const [phrase, slugs] of keywords) {
      if (!includesPhrase(normalized, phrase)) continue;
      for (const slug of slugs) add(bySlug.get(slug));
    }
  }

  return [...matched.values()];
}

export function mapTermsToIds(
  terms: string[],
  catalog: CatalogTerm[],
  keywords: KeywordMap
): number[] {
  return mapTermsToCatalog(terms, catalog, keywords).map((item) => item.id);
}

export function isStrongCatalogMatch(query: string, item: CatalogTerm): boolean {
  const q = normalizeTerm(query);
  if (!q) return false;
  const name = catalogKey(item);
  const slug = item.slug.replace(/-/g, " ");
  if (name === q || slug === q || name.startsWith(q) || slug.startsWith(q)) {
    return true;
  }
  return q.length >= 3 && (name.includes(q) || slug.includes(q));
}

export function suggestCatalogTerms(
  query: string,
  catalog: CatalogTerm[],
  selected: string[],
  keywords: KeywordMap,
  limit = 8
): CatalogTerm[] {
  const selectedKeys = new Set(selected.map(normalizeTerm));
  const available = catalog.filter(
    (item) => !selectedKeys.has(catalogKey(item))
  );
  const normalized = normalizeTerm(query);

  if (!normalized) {
    return [];
  }

  const scored = available.map((item) => {
    const name = catalogKey(item);
    let score = 0;
    if (name === normalized) score = 100;
    else if (name.startsWith(normalized)) score = 80;
    else if (name.includes(normalized)) score = 60;
    else if (item.slug.replace(/-/g, " ").includes(normalized)) score = 50;
    else if (
      mapTermsToCatalog([query], [item], keywords).some((m) => m.id === item.id)
    ) {
      score = 40;
    }
    return { item, score };
  });

  return scored
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
    .map((row) => row.item);
}

export function relatedCatalogTerms(
  tags: string[],
  catalog: CatalogTerm[],
  keywords: KeywordMap,
  limit = 5
): CatalogTerm[] {
  const selectedKeys = new Set(tags.map(normalizeTerm));
  return mapTermsToCatalog(tags, catalog, keywords)
    .filter((item) => !selectedKeys.has(catalogKey(item)))
    .slice(0, limit);
}
