import { z } from "zod";
import {
  MAX_PROFILE_SERVICES,
  MAX_PROFILE_SKILLS,
  MAX_SERVICE_TAG_LENGTH,
  MAX_SKILL_TAG_LENGTH,
  normalizeFreeTextTags,
} from "@/lib/taxonomy-map";

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

export type WorkExampleInput = {
  title: string;
  description?: string;
  url: string;
};

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

function normalizeWorkExamples(value: unknown): WorkExampleInput[] {
  const raw = parseWorkExamplesJson(value);
  const normalized: WorkExampleInput[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const title =
      typeof record.title === "string"
        ? record.title.trim().replace(/\s+/g, " ")
        : "";
    const description =
      typeof record.description === "string"
        ? record.description.trim().replace(/\s+/g, " ")
        : "";
    const url =
      typeof record.url === "string" ? normalizeUrl(record.url) : null;

    if (title.length < 2 || title.length > 120 || !url) continue;

    normalized.push({
      title,
      ...(description && description.length <= 500
        ? { description }
        : undefined),
      url,
    });

    if (normalized.length >= MAX_WORK_EXAMPLES) break;
  }

  return normalized;
}

export const profileSchema = z.object({
  profileType: z.enum(["individual", "company"]).default("individual"),
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  headline: z.string().max(120).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(100).optional(),
  hourlyRate: optionalNumber,
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
  workExamples: z.preprocess(
    normalizeWorkExamples,
    z
      .array(
        z.object({
          title: z.string().min(2).max(120),
          description: z.string().max(500).optional(),
          url: z.string().url(),
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
