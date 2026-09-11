import type { ExpertProfile, Service, Skill } from "@/db/schema";
import { isCompanyProfile } from "@/lib/profile-type";

export const MAX_CUSTOM_SKILLS = 10;
export const MAX_CUSTOM_SERVICES = 10;

const COMPLETE_TAG_VERSION = 2;

function normalizeTagList(parsed: unknown): string[] {
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((item): item is string => typeof item === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parse a JSON string array, or the v2 `{ v: 2, tags }` object used after tag-input saves. */
function parseCustomTagPayload(raw: string | null | undefined): {
  tags: string[];
  complete: boolean;
} {
  if (!raw?.trim()) return { tags: [], complete: false };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { tags: normalizeTagList(parsed), complete: false };
    }
    if (parsed && typeof parsed === "object") {
      const record = parsed as Record<string, unknown>;
      if (record.v === COMPLETE_TAG_VERSION && Array.isArray(record.tags)) {
        return { tags: normalizeTagList(record.tags), complete: true };
      }
    }
  } catch {
    return { tags: [], complete: false };
  }
  return { tags: [], complete: false };
}

function parseCustomTags(raw: string | null | undefined): string[] {
  return parseCustomTagPayload(raw).tags;
}

export const parseCustomSkills = parseCustomTags;
export const parseCustomServices = parseCustomTags;
export const parseExternalLinks = parseCustomTags;

export function hasCompleteCustomSkills(
  raw: string | null | undefined
): boolean {
  return parseCustomTagPayload(raw).complete;
}

export function hasCompleteCustomServices(
  raw: string | null | undefined
): boolean {
  return parseCustomTagPayload(raw).complete;
}

export function mergeUniqueTags(...groups: string[][]): string[] {
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    for (const item of group) {
      const key = item.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }
  }
  return unique;
}

export function getProfileSkillLabels(profile: {
  customSkills?: string | null;
  skills: { skill: { name: string } }[];
}): string[] {
  const custom = parseCustomSkills(profile.customSkills);
  if (hasCompleteCustomSkills(profile.customSkills)) return custom;
  return mergeUniqueTags(
    profile.skills.map((s) => s.skill.name),
    custom
  );
}

export function getProfileServiceLabels(profile: {
  customServices?: string | null;
  services: { service: { name: string } }[];
}): string[] {
  const custom = parseCustomServices(profile.customServices);
  if (hasCompleteCustomServices(profile.customServices)) return custom;
  return mergeUniqueTags(
    profile.services.map((s) => s.service.name),
    custom
  );
}

export function getProfileSkillDisplayTags(profile: {
  customSkills?: string | null;
  skills: { skill: { name: string; slug: string } }[];
}): { name: string; href: string }[] {
  const byName = new Map(
    profile.skills.map((s) => [s.skill.name.toLowerCase(), s.skill])
  );
  return getProfileSkillLabels(profile).map((name) => {
    const skill = byName.get(name.toLowerCase());
    return {
      name,
      href: skill
        ? `/search?skill=${skill.slug}`
        : `/search?q=${encodeURIComponent(name)}`,
    };
  });
}

export function getProfileServiceDisplayTags(profile: {
  customServices?: string | null;
  services: { service: { name: string; slug: string } }[];
}): { name: string; href: string }[] {
  const byName = new Map(
    profile.services.map((s) => [s.service.name.toLowerCase(), s.service])
  );
  return getProfileServiceLabels(profile).map((name) => {
    const service = byName.get(name.toLowerCase());
    return {
      name,
      href: service
        ? `/search?service=${service.slug}`
        : `/search?q=${encodeURIComponent(name)}`,
    };
  });
}

export type WorkExample = {
  title: string;
  description?: string;
  url: string;
};

/** Parse external work examples stored as JSON on profiles. */
export function parseWorkExamples(
  raw: string | null | undefined
): WorkExample[] {
  if (!raw?.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const examples: WorkExample[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const record = item as Record<string, unknown>;
      const title =
        typeof record.title === "string" ? record.title.trim() : "";
      const url = typeof record.url === "string" ? record.url.trim() : "";
      const description =
        typeof record.description === "string"
          ? record.description.trim()
          : "";
      if (!title || !url) continue;
      examples.push({
        title,
        url,
        ...(description ? { description } : undefined),
      });
    }
    return examples;
  } catch {
    return [];
  }
}

export type ProfileWithRelations = ExpertProfile & {
  skills: { skill: Skill }[];
  services: { service: Service }[];
};

type ProfileCheck = {
  label: string;
  check: (profile: ProfileWithRelations) => boolean;
};

/** Fields that make a profile useful to clients — used for dashboard guidance and ranking. */
const SHARED_PROFILE_CHECKS: ProfileCheck[] = [
  { label: "Add a profile photo", check: (p) => !!p.profileImageUrl?.trim() },
  { label: "Add a headline", check: (p) => !!p.headline?.trim() },
  { label: "Write your bio", check: (p) => !!p.bio?.trim() },
  { label: "Add your location", check: (p) => !!p.location?.trim() },
  { label: "Add at least one skill", check: (p) => p.skills.length > 0 || parseCustomSkills(p.customSkills).length > 0 },
  { label: "Add at least one service", check: (p) => p.services.length > 0 || parseCustomServices(p.customServices).length > 0 },
  {
    label: "Add a LinkedIn, website, or other external link",
    check: (p) =>
      !!(
        p.linkedinUrl?.trim() ||
        p.githubUrl?.trim() ||
        p.websiteUrl?.trim() ||
        parseExternalLinks(p.externalLinks).length > 0
      ),
  },
];

const INDIVIDUAL_PROFILE_CHECKS: ProfileCheck[] = [
  { label: "Add a profile photo", check: (p) => !!p.profileImageUrl?.trim() },
  { label: "Add a headline", check: (p) => !!p.headline?.trim() },
  { label: "Write your bio", check: (p) => !!p.bio?.trim() },
  { label: "Add your location", check: (p) => !!p.location?.trim() },
  { label: "Set your hourly rate", check: (p) => p.hourlyRate != null },
  { label: "Set your availability", check: (p) => !!p.availability },
  { label: "Add at least one skill", check: (p) => p.skills.length > 0 || parseCustomSkills(p.customSkills).length > 0 },
  { label: "Add at least one service", check: (p) => p.services.length > 0 || parseCustomServices(p.customServices).length > 0 },
  {
    label: "Add a LinkedIn, GitHub, or website link",
    check: (p) =>
      !!(p.linkedinUrl?.trim() || p.githubUrl?.trim() || p.websiteUrl?.trim()),
  },
];

const COMPANY_PROFILE_CHECKS: ProfileCheck[] = [
  { label: "Add a company logo", check: (p) => !!p.profileImageUrl?.trim() },
  { label: "Add a company size", check: (p) => !!p.companySize?.trim() },
  ...SHARED_PROFILE_CHECKS.slice(1),
];

function profileChecksFor(profile: ProfileWithRelations): ProfileCheck[] {
  return isCompanyProfile(profile)
    ? COMPANY_PROFILE_CHECKS
    : INDIVIDUAL_PROFILE_CHECKS;
}

export function computeCompleteness(profile: ProfileWithRelations): number {
  const checks = profileChecksFor(profile);
  const filled = checks.filter(({ check }) => check(profile)).length;
  return Math.round((filled / checks.length) * 100);
}

/** Actionable items the expert can complete to improve their profile. */
export function getProfileCompletenessSuggestions(
  profile: ProfileWithRelations
): string[] {
  return profileChecksFor(profile)
    .filter(({ check }) => !check(profile))
    .map(({ label }) => label);
}

/**
 * Directory ranking (highest priority first):
 * 1. Featured profiles
 * 2. Profile completeness (%)
 * 3. Availability (available → limited → unavailable → unset)
 * 4. Newest profiles
 */
export function compareProfiles(
  a: ProfileWithRelations,
  b: ProfileWithRelations
): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;

  const compDiff = computeCompleteness(b) - computeCompleteness(a);
  if (compDiff !== 0) return compDiff;

  const availDiff =
    availabilityRank(a) - availabilityRank(b);
  if (availDiff !== 0) return availDiff;

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function availabilityRank(profile: ProfileWithRelations): number {
  if (isCompanyProfile(profile)) return 1;

  switch (profile.availability) {
    case "available":
      return 0;
    case "limited":
      return 1;
    case "unavailable":
      return 2;
    default:
      return 3;
  }
}

export function rankProfiles(
  profiles: ProfileWithRelations[]
): ProfileWithRelations[] {
  return [...profiles].sort(compareProfiles);
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: "Available now",
  limited: "Limited availability",
  unavailable: "Not available",
};

export const RANKING_DESCRIPTION =
  "Sorted by featured status, profile completeness, availability, and recency.";
