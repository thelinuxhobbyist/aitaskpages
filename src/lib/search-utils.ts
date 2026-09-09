import type { ProfileWithRelations } from "@/lib/profile-utils";
import { parseCustomSkills, parseCustomServices } from "@/lib/profile-utils";
import { isCompanyProfile } from "@/lib/profile-type";
import type { DirectoryFilters } from "@/lib/validations/directory";

/** Words ignored when matching free-text search — keeps queries like "in London" natural. */
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "for",
  "in",
  "near",
  "of",
  "or",
  "the",
  "to",
  "with",
]);

/** Split a human query into meaningful tokens (stop words removed). */
export function tokenizeQuery(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[\s,./]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));
}

/** Searchable text for one expert profile. */
export function profileHaystack(profile: ProfileWithRelations): string {
  return [
    profile.fullName,
    profile.headline,
    profile.bio,
    profile.location,
    ...profile.skills.map((s) => s.skill.name),
    ...parseCustomSkills(profile.customSkills),
    ...profile.services.map((s) => s.service.name),
    ...parseCustomServices(profile.customServices),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/** True when every query token appears somewhere on the profile. */
export function matchesTextQuery(
  profile: ProfileWithRelations,
  q: string
): boolean {
  const tokens = tokenizeQuery(q);
  if (tokens.length === 0) return true;
  const haystack = profileHaystack(profile);
  return tokens.every((token) => haystack.includes(token));
}

/** Apply directory filters in memory (used after loading profiles with relations). */
export function filterProfiles(
  profiles: ProfileWithRelations[],
  filters: DirectoryFilters
): ProfileWithRelations[] {
  const loc = filters.location?.trim().toLowerCase();

  return profiles.filter((p) => {
    const company = isCompanyProfile(p);

    if (filters.type === "individual" && company) return false;
    if (filters.type === "company" && !company) return false;

    if (filters.q && !matchesTextQuery(p, filters.q)) return false;
    if (filters.skill && !p.skills.some((s) => s.skill.slug === filters.skill))
      return false;
    if (
      filters.service &&
      !p.services.some((s) => s.service.slug === filters.service)
    )
      return false;
    if (loc && !(p.location ?? "").toLowerCase().includes(loc)) return false;

    // Rate/availability are individual-specific. Companies stay in "All"
    // results even when those filters are set.
    if (filters.type !== "company" && !company) {
      if (
        filters.minRate != null &&
        (p.hourlyRate == null || p.hourlyRate < filters.minRate)
      )
        return false;
      if (
        filters.maxRate != null &&
        (p.hourlyRate == null || p.hourlyRate > filters.maxRate)
      )
        return false;
    }

    return true;
  });
}
