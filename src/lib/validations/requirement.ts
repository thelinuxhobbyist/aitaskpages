import { z } from "zod";
import {
  MAX_SERVICE_TAG_LENGTH,
  MAX_SKILL_TAG_LENGTH,
  MAX_TASK_SERVICES,
  MAX_TASK_SKILLS,
  normalizeFreeTextTags,
} from "@/lib/taxonomy-map";

export const requirementSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200),
  description: z
    .string()
    .min(30, "Description must be at least 30 characters")
    .max(10000),
  companyName: z
    .string()
    .trim()
    .min(2, "Company name is required")
    .max(100, "Company name must be 100 characters or fewer"),
  budget: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  remoteOk: z.coerce.boolean().default(false),
  customSkills: z
    .array(z.string())
    .default([])
    .transform((values) =>
      normalizeFreeTextTags(values, MAX_TASK_SKILLS, MAX_SKILL_TAG_LENGTH)
    ),
  customServices: z
    .array(z.string())
    .default([])
    .transform((values) =>
      normalizeFreeTextTags(values, MAX_TASK_SERVICES, MAX_SERVICE_TAG_LENGTH)
    ),
});

export type RequirementFormData = z.infer<typeof requirementSchema>;

export const interestSchema = z.object({
  requirementId: z.coerce.number().int().positive(),
  message: z
    .string()
    .max(2000)
    .optional()
    .transform((v) => v?.trim() || undefined),
});

export type InterestFormData = z.infer<typeof interestSchema>;

export type RequirementFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  requirementId?: number;
};

export type InterestFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

function parseRemoteOk(formData: FormData): boolean {
  const value = formData.get("remoteOk");
  return value === "on" || value === "true" || value === "1";
}

export function parseRequirementFormData(formData: FormData) {
  return requirementSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    companyName: formData.get("companyName"),
    budget: formData.get("budget") || undefined,
    location: formData.get("location") || undefined,
    remoteOk: parseRemoteOk(formData),
    customSkills: formData.getAll("customSkills"),
    customServices: formData.getAll("customServices"),
  });
}
