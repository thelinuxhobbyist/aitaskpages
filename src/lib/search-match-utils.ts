import {
  compareProfiles,
  type ProfileWithRelations,
} from "@/lib/profile-utils";
import type { DirectoryFilters } from "@/lib/validations/directory";

export function getProfileMatchLabels(
  profile: ProfileWithRelations,
  filters: DirectoryFilters,
  labels: { skills: Map<string, string>; services: Map<string, string> }
): string[] {
  const matches: string[] = [];

  if (filters.location?.trim() && profile.location) {
    if (
      profile.location
        .toLowerCase()
        .includes(filters.location.trim().toLowerCase())
    ) {
      matches.push(filters.location.trim());
    }
  }

  if (filters.skill) {
    const name = labels.skills.get(filters.skill) ?? filters.skill;
    if (profile.skills.some((s) => s.skill.slug === filters.skill)) {
      matches.push(name);
    }
  }

  if (filters.service) {
    const name = labels.services.get(filters.service) ?? filters.service;
    if (profile.services.some((s) => s.service.slug === filters.service)) {
      matches.push(name);
    }
  }

  if (filters.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    const inProfile =
      profile.fullName.toLowerCase().includes(q) ||
      profile.headline?.toLowerCase().includes(q) ||
      profile.bio?.toLowerCase().includes(q) ||
      profile.skills.some((s) => s.skill.name.toLowerCase().includes(q));
    if (inProfile) {
      matches.push(`"${filters.q.trim()}"`);
    }
  }

  return matches;
}

export function sortSearchResults(
  profiles: ProfileWithRelations[],
  sort: string | undefined
): ProfileWithRelations[] {
  const list = [...profiles];

  if (sort === "recent") {
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  if (sort === "available") {
    return list.sort((a, b) => {
      const aAvail = a.availability === "available" ? 0 : 1;
      const bAvail = b.availability === "available" ? 0 : 1;
      if (aAvail !== bAvail) return aAvail - bAvail;
      return compareProfiles(a, b);
    });
  }

  return list;
}
