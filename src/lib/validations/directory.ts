import { z } from "zod";

export const directoryFiltersSchema = z.object({
  q: z.string().optional(),
  skill: z.string().optional(),
  service: z.string().optional(),
  location: z.string().optional(),
  availability: z
    .enum(["available", "limited", "unavailable"])
    .optional()
    .catch(undefined),
  minRate: z.coerce.number().int().min(0).optional().catch(undefined),
  maxRate: z.coerce.number().int().min(0).optional().catch(undefined),
  sort: z.enum(["match", "recent", "available"]).optional(),
});

export type DirectoryFilters = z.infer<typeof directoryFiltersSchema>;

/**
 * Params that control presentation rather than which experts match. They are
 * excluded from "has the visitor searched?" checks and from the filter chips.
 */
export const DIRECTORY_VIEW_PARAMS = ["sort"] as const;

/** True when at least one real filter narrows the result set. */
export function hasActiveFilters(filters: DirectoryFilters): boolean {
  return Object.entries(filters).some(([key, value]) => {
    if ((DIRECTORY_VIEW_PARAMS as readonly string[]).includes(key)) return false;
    if (value === undefined || value === "") return false;
    if (typeof value === "string" && !value.trim()) return false;
    return true;
  });
}

export function parseDirectoryFilters(
  searchParams: Record<string, string | string[] | undefined>
): DirectoryFilters {
  const get = (key: string) => {
    const val = searchParams[key];
    return typeof val === "string" ? val : undefined;
  };

  return directoryFiltersSchema.parse({
    q: get("q") || undefined,
    skill: get("skill") || undefined,
    service: get("service") || undefined,
    location: get("location") || undefined,
    availability: get("availability") || undefined,
    minRate: get("minRate") || undefined,
    maxRate: get("maxRate") || undefined,
    sort: get("sort") || undefined,
  });
}
