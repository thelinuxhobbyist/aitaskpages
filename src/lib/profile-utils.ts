import type { FreelancerProfile, Service, Skill } from "@/db/schema";

export type ProfileWithRelations = FreelancerProfile & {
  skills: { skill: Skill }[];
  services: { service: Service }[];
};

const COMPLETENESS_FIELDS = [
  (p: ProfileWithRelations) => !!p.fullName,
  (p: ProfileWithRelations) => !!p.headline,
  (p: ProfileWithRelations) => !!p.bio,
  (p: ProfileWithRelations) => !!p.location,
  (p: ProfileWithRelations) => p.hourlyRate != null,
  (p: ProfileWithRelations) => !!p.availability,
  (p: ProfileWithRelations) => p.skills.length > 0,
  (p: ProfileWithRelations) => p.services.length > 0,
  (p: ProfileWithRelations) =>
    !!(p.linkedinUrl || p.githubUrl || p.websiteUrl),
] as const;

export function computeCompleteness(profile: ProfileWithRelations): number {
  const filled = COMPLETENESS_FIELDS.filter((check) => check(profile)).length;
  return Math.round((filled / COMPLETENESS_FIELDS.length) * 100);
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
