import { z } from "zod";
import {
  DEFAULT_RATE_CURRENCY,
  RATE_CURRENCIES,
  normalizeRateCurrency,
} from "@/lib/currency";
import {
  MAX_HELP_WITH,
  MAX_INDUSTRIES,
  MAX_TOPIC_LENGTH,
} from "@/lib/expertise-topics";
import {
  MAX_PROFILE_SERVICES,
  MAX_PROFILE_SKILLS,
  MAX_SERVICE_TAG_LENGTH,
  MAX_SKILL_TAG_LENGTH,
  normalizeFreeTextTags,
} from "@/lib/taxonomy-map";

const rateCurrencyCodes = RATE_CURRENCIES.map((item) => item.code) as [
  (typeof RATE_CURRENCIES)[number]["code"],
  ...(typeof RATE_CURRENCIES)[number]["code"][],
];

const optionalUrl = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const s = String(val).trim();
    if (s === "") return undefined;
    // Allow entering "mywebsite.com" without a scheme — default to https.
    return /^https?:\/\//i.test(s) ? s : `https://${s}`;
  },
  z.string().url("Invalid URL").optional()
);

// Profile image may be an app-served upload ("/api/images/…") or an external URL.
const optionalImageUrl = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const s = String(val).trim();
    if (s === "") return undefined;
    if (s.startsWith("/")) return s; // uploaded image served by the worker
    return /^https?:\/\//i.test(s) ? s : `https://${s}`;
  },
  z
    .string()
    .refine(
      (s) => s.startsWith("/") || /^https?:\/\/.+/i.test(s),
      "Invalid image URL"
    )
    .optional()
);

const optionalNumber = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? undefined : val),
  z.coerce.number().int().min(0).max(10000).optional()
);

const optionalYear = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? undefined : val),
  z.coerce.number().int().min(1900).max(new Date().getFullYear()).optional()
);

const optionalString = (max: number) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const s = String(val).trim();
      return s === "" ? undefined : s;
    },
    z.string().max(max).optional()
  );

export const MAX_EXTERNAL_LINKS = 8;

function normalizeExternalLinks(value: unknown): string[] {
  let lines: string[] = [];

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          lines = parsed.filter((item): item is string => typeof item === "string");
        }
      } catch {
        lines = value.split(/\r?\n/);
      }
    } else {
      lines = value.split(/\r?\n/);
    }
  } else if (Array.isArray(value)) {
    lines = value.filter((item): item is string => typeof item === "string");
  }

  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const result = z.string().url().safeParse(url);
    if (!result.success) continue;
    if (seen.has(result.data)) continue;
    seen.add(result.data);
    normalized.push(result.data);
    if (normalized.length >= MAX_EXTERNAL_LINKS) break;
  }

  return normalized;
}

function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const result = z.string().url().safeParse(withScheme);
  return result.success ? result.data : null;
}

export const MAX_WORK_EXAMPLES = 8;

export const MAX_CAPABILITIES = 5;

export type CapabilityInput = {
  title: string;
  description: string;
};

export type WorkExampleInput = {
  title: string;
  description?: string;
  url?: string;
  outcome?: string;
  industry?: string;
  role?: string;
  technologies?: string[];
  imageUrl?: string;
};

function cleanLine(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  const text = value.trim().replace(/[ \t]+/g, " ");
  return text.length > max ? text.slice(0, max) : text;
}

function cleanParagraph(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  const text = value.trim().replace(/[ \t]+/g, " ");
  return text.length > max ? text.slice(0, max) : text;
}

function parseWorkExamplesJson(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeCapabilities(value: unknown): CapabilityInput[] {
  const raw = parseWorkExamplesJson(value);
  const normalized: CapabilityInput[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const title = cleanLine(record.title, 80);
    const description = cleanParagraph(record.description, 500);
    if (title.length < 2 || description.length < 20) continue;
    normalized.push({ title, description });
    if (normalized.length >= MAX_CAPABILITIES) break;
  }

  return normalized;
}

function normalizeTechnologyList(value: unknown): string[] {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  return normalizeFreeTextTags(
    source.filter((item): item is string => typeof item === "string"),
    8,
    40
  );
}

function normalizeWorkExamples(value: unknown): WorkExampleInput[] {
  const raw = parseWorkExamplesJson(value);
  const normalized: WorkExampleInput[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const title = cleanLine(record.title, 120);
    const description = cleanParagraph(record.description, 800);
    const outcome = cleanParagraph(record.outcome, 400);
    const industry = cleanLine(record.industry, 80);
    const role = cleanLine(record.role, 80);
    const url =
      typeof record.url === "string" ? normalizeUrl(record.url) : null;
    const imageUrl =
      typeof record.imageUrl === "string" ? normalizeUrl(record.imageUrl) : null;
    const technologies = normalizeTechnologyList(record.technologies);

    if (title.length < 2) continue;
    if (!description && !url) continue;

    normalized.push({
      title,
      ...(description ? { description } : undefined),
      ...(url ? { url } : undefined),
      ...(outcome ? { outcome } : undefined),
      ...(industry ? { industry } : undefined),
      ...(role ? { role } : undefined),
      ...(technologies.length > 0 ? { technologies } : undefined),
      ...(imageUrl ? { imageUrl } : undefined),
    });

    if (normalized.length >= MAX_WORK_EXAMPLES) break;
  }

  return normalized;
}

export const profileSchema = z.object({
  profileType: z.enum(["individual", "company"]).default("individual"),
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  headline: z.string().max(120).optional(),
  bio: z.string().max(4000).optional(),
  location: z.string().max(100).optional(),
  hourlyRate: optionalNumber,
  hourlyRateCurrency: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) {
        return DEFAULT_RATE_CURRENCY;
      }
      return normalizeRateCurrency(val);
    },
    z.enum(rateCurrencyCodes).default(DEFAULT_RATE_CURRENCY)
  ),
  companySize: optionalString(60),
  yearEstablished: optionalYear,
  availability: z
    .union([
      z.enum(["available", "limited", "unavailable"]),
      z.literal(""),
    ])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  websiteUrl: optionalUrl,
  externalLinks: z
    .preprocess((val) => (val == null ? "" : val), z.string())
    .transform(normalizeExternalLinks),
  profileImageUrl: optionalImageUrl,
  skillIds: z.array(z.coerce.number()).default([]),
  serviceIds: z.array(z.coerce.number()).default([]),
  customSkills: z
    .array(z.string())
    .default([])
    .transform((values) =>
      normalizeFreeTextTags(values, MAX_PROFILE_SKILLS, MAX_SKILL_TAG_LENGTH)
    ),
  customServices: z
    .array(z.string())
    .default([])
    .transform((values) =>
      normalizeFreeTextTags(
        values,
        MAX_PROFILE_SERVICES,
        MAX_SERVICE_TAG_LENGTH
      )
    ),
  industries: z
    .array(z.string())
    .default([])
    .transform((values) =>
      normalizeFreeTextTags(values, MAX_INDUSTRIES, MAX_TOPIC_LENGTH)
    ),
  helpWith: z
    .array(z.string())
    .default([])
    .transform((values) =>
      normalizeFreeTextTags(values, MAX_HELP_WITH, MAX_TOPIC_LENGTH)
    ),
  capabilities: z.preprocess(
    normalizeCapabilities,
    z
      .array(
        z.object({
          title: z.string().min(2).max(80),
          description: z.string().min(20).max(500),
        })
      )
      .max(MAX_CAPABILITIES)
  ),
  workExamples: z.preprocess(
    normalizeWorkExamples,
    z
      .array(
        z.object({
          title: z.string().min(2).max(120),
          description: z.string().max(800).optional(),
          url: z.string().url().optional(),
          outcome: z.string().max(400).optional(),
          industry: z.string().max(80).optional(),
          role: z.string().max(80).optional(),
          technologies: z.array(z.string()).max(8).optional(),
          imageUrl: z.string().url().optional(),
        })
      )
      .max(MAX_WORK_EXAMPLES)
  ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type WorkExample = ProfileFormData["workExamples"][number];

export type ProfileFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};
