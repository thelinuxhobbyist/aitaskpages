import { z } from "zod";

export const directoryFiltersSchema = z.object({
  q: z.string().optional(),
  skill: z.string().optional(),
  service: z.string().optional(),
  location: z.string().optional(),
  minRate: z.coerce.number().int().min(0).optional().catch(undefined),
  maxRate: z.coerce.number().int().min(0).optional().catch(undefined),
});

export type DirectoryFilters = z.infer<typeof directoryFiltersSchema>;

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
    minRate: get("minRate") || undefined,
    maxRate: get("maxRate") || undefined,
  });
}
