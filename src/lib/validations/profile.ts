import { z } from "zod";

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

function normalizeCustomTags(values: string[], max: number): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const raw of values) {
    const name = raw.trim().replace(/\s+/g, " ");
    if (name.length < 2 || name.length > 50) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(name);
    if (normalized.length >= max) break;
  }

  return normalized;
}

export const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  headline: z.string().max(120).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(100).optional(),
  hourlyRate: optionalNumber,
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
  profileImageUrl: optionalImageUrl,
  skillIds: z.array(z.coerce.number()).default([]),
  serviceIds: z.array(z.coerce.number()).default([]),
  customSkills: z
    .array(z.string())
    .default([])
    .transform((values) => normalizeCustomTags(values, 10)),
  customServices: z
    .array(z.string())
    .default([])
    .transform((values) => normalizeCustomTags(values, 10)),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export type ProfileFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};
