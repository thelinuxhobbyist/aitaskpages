import type { ExpertProfile, Service, Skill } from "@/db/schema";

export type ProfileWithRelations = ExpertProfile & {
  skills: { skill: Skill }[];
  services: { service: Service }[];
};

type ProfileCheck = {
  label: string;
  check: (profile: ProfileWithRelations) => boolean;
};

/** Fields that make a profile useful to clients — used for dashboard guidance and ranking. */
const PROFILE_CHECKS: ProfileCheck[] = [
  { label: "Add a profile photo", check: (p) => !!p.profileImageUrl?.trim() },
  { label: "Add a headline", check: (p) => !!p.headline?.trim() },
  { label: "Write your bio", check: (p) => !!p.bio?.trim() },
  { label: "Add your location", check: (p) => !!p.location?.trim() },
  { label: "Set your hourly rate", check: (p) => p.hourlyRate != null },
  { label: "Set your availability", check: (p) => !!p.availability },
  { label: "Add at least one skill", check: (p) => p.skills.length > 0 },
  { label: "Add at least one service", check: (p) => p.services.length > 0 },
  {
    label: "Add a LinkedIn, GitHub, or website link",
    check: (p) =>
      !!(p.linkedinUrl?.trim() || p.githubUrl?.trim() || p.websiteUrl?.trim()),
  },
];

export function computeCompleteness(profile: ProfileWithRelations): number {
  const filled = PROFILE_CHECKS.filter(({ check }) => check(profile)).length;
  return Math.round((filled / PROFILE_CHECKS.length) * 100);
}

/** Actionable items the expert can complete to improve their profile. */
export function getProfileCompletenessSuggestions(
  profile: ProfileWithRelations
): string[] {
  return PROFILE_CHECKS.filter(({ check }) => !check(profile)).map(
    ({ label }) => label
  );
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

  const availDiff = availabilityRank(a.availability) - availabilityRank(b.availability);
  if (availDiff !== 0) return availDiff;

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function availabilityRank(availability: string | null): number {
  switch (availability) {
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
