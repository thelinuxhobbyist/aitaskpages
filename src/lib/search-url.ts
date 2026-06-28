import type { DirectoryFilters } from "@/lib/validations/directory";

/** Build a /search URL with one filter removed (for chip "×" links). */
export function buildSearchUrl(
  filters: DirectoryFilters,
  omit?: keyof DirectoryFilters
): string {
  const params = new URLSearchParams();
  if (filters.q && omit !== "q") params.set("q", filters.q);
  if (filters.skill && omit !== "skill") params.set("skill", filters.skill);
  if (filters.service && omit !== "service")
    params.set("service", filters.service);
  if (filters.location && omit !== "location")
    params.set("location", filters.location);
  if (filters.minRate != null && omit !== "minRate")
    params.set("minRate", String(filters.minRate));
  if (filters.maxRate != null && omit !== "maxRate")
    params.set("maxRate", String(filters.maxRate));
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

export type ActiveFilter = {
  key: keyof DirectoryFilters;
  label: string;
  href: string;
};

export function getActiveFilters(
  filters: DirectoryFilters,
  labels: { skills: Map<string, string>; services: Map<string, string> }
): ActiveFilter[] {
  const items: ActiveFilter[] = [];

  if (filters.q?.trim()) {
    items.push({
      key: "q",
      label: `"${filters.q.trim()}"`,
      href: buildSearchUrl(filters, "q"),
    });
  }
  if (filters.skill) {
    items.push({
      key: "skill",
      label: labels.skills.get(filters.skill) ?? filters.skill,
      href: buildSearchUrl(filters, "skill"),
    });
  }
  if (filters.service) {
    items.push({
      key: "service",
      label: labels.services.get(filters.service) ?? filters.service,
      href: buildSearchUrl(filters, "service"),
    });
  }
  if (filters.location?.trim()) {
    items.push({
      key: "location",
      label: filters.location.trim(),
      href: buildSearchUrl(filters, "location"),
    });
  }
  if (filters.minRate != null) {
    items.push({
      key: "minRate",
      label: `From £${filters.minRate}/hr`,
      href: buildSearchUrl(filters, "minRate"),
    });
  }
  if (filters.maxRate != null) {
    items.push({
      key: "maxRate",
      label: `Up to £${filters.maxRate}/hr`,
      href: buildSearchUrl(filters, "maxRate"),
    });
  }

  return items;
}
