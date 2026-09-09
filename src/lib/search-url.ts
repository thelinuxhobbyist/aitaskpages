import type { DirectoryFilters } from "@/lib/validations/directory";

/** Build a /search URL with one filter removed (for chip "×" links). */
export function buildSearchUrl(
  filters: DirectoryFilters,
  omit?: keyof DirectoryFilters
): string {
  const params = new URLSearchParams();
  if (filters.q && omit !== "q") params.set("q", filters.q);
  if (filters.type && omit !== "type") params.set("type", filters.type);
  if (filters.skill && omit !== "skill") params.set("skill", filters.skill);
  if (filters.service && omit !== "service")
    params.set("service", filters.service);
  if (filters.location && omit !== "location")
    params.set("location", filters.location);
  if (filters.minRate != null && omit !== "minRate")
    params.set("minRate", String(filters.minRate));
  if (filters.maxRate != null && omit !== "maxRate")
    params.set("maxRate", String(filters.maxRate));
  if (filters.availability && omit !== "availability")
    params.set("availability", filters.availability);
  if (filters.sort && filters.sort !== "match" && omit !== "sort")
    params.set("sort", filters.sort);
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
  if (filters.type === "individual") {
    items.push({
      key: "type",
      label: "Individuals",
      href: buildSearchUrl(filters, "type"),
    });
  }
  if (filters.type === "company") {
    items.push({
      key: "type",
      label: "Companies",
      href: buildSearchUrl(filters, "type"),
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
  if (filters.availability) {
    const labels: Record<string, string> = {
      available: "Available now",
      limited: "Limited availability",
      unavailable: "Not available",
    };
    items.push({
      key: "availability",
      label: labels[filters.availability] ?? filters.availability,
      href: buildSearchUrl(filters, "availability"),
    });
  }

  return items;
}

/** Switch All / Individuals / Companies without dropping other filters. */
export function buildProfileTypeUrl(
  filters: DirectoryFilters,
  type: "all" | "individual" | "company"
): string {
  const next: DirectoryFilters = {
    ...filters,
    type: type === "all" ? undefined : type,
  };
  if (type === "company") {
    next.minRate = undefined;
    next.maxRate = undefined;
    next.availability = undefined;
  }
  return buildSearchUrl(next);
}
