import {
  and,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  like,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { getDb, withD1Retry } from "@/db/client";
import { expertProfiles, users } from "@/db/schema";
import {
  PUBLIC_PROFILE_STATUS,
  publicExpertProfileConditions,
} from "@/lib/directory-filters";
import { EXPERT_DIRECTORY_LIMITS } from "@/lib/directory-limits";
import {
  rankProfiles,
  type ProfileWithRelations,
} from "@/lib/profile-utils";
import { filterProfiles } from "@/lib/search-utils";
import type { DirectoryFilters } from "@/lib/validations/directory";

type Db = Awaited<ReturnType<typeof getDb>>;

/** Hydrate skills/services for an already-narrowed set of profile ids. */
async function loadProfilesWithRelations(
  db: Db,
  ids: number[]
): Promise<ProfileWithRelations[]> {
  if (ids.length === 0) return [];

  const profiles = await db.query.expertProfiles.findMany({
    where: inArray(expertProfiles.id, ids),
    with: {
      skills: { with: { skill: true } },
      services: { with: { service: true } },
    },
  });

  return profiles as ProfileWithRelations[];
}

async function fetchPublicProfiles(
  extraConditions: ReturnType<typeof and>[] = [],
  limit: number = EXPERT_DIRECTORY_LIMITS.maxScannedProfiles
): Promise<ProfileWithRelations[]> {
  return withD1Retry("fetchPublicProfiles", async () => {
    const db = await getDb();
    const where = publicExpertProfileConditions(
      extraConditions.length > 0 ? and(...extraConditions) : undefined
    );

    // Ordered so the cap takes a stable slice (newest profiles) rather than
    // whatever SQLite happens to return first.
    const rows = await db
      .select({ id: expertProfiles.id })
      .from(expertProfiles)
      .innerJoin(users, eq(expertProfiles.userId, users.id))
      .where(where)
      .orderBy(desc(expertProfiles.createdAt))
      .limit(limit);

    return loadProfilesWithRelations(
      db,
      rows.map((r) => r.id)
    );
  });
}

/**
 * Newest approved profiles, for the directory's default state.
 *
 * Returns at most `limit` profiles — and fewer when the platform has fewer —
 * so the page never renders the whole database.
 */
export async function getRecentExperts(
  limit = EXPERT_DIRECTORY_LIMITS.defaultCards
): Promise<ProfileWithRelations[]> {
  if (limit <= 0) return [];

  return withD1Retry("getRecentExperts", async () => {
    const db = await getDb();
    const rows = await db
      .select({ id: expertProfiles.id })
      .from(expertProfiles)
      .innerJoin(users, eq(expertProfiles.userId, users.id))
      .where(publicExpertProfileConditions())
      .orderBy(desc(expertProfiles.createdAt))
      .limit(limit);

    const ids = rows.map((r) => r.id);
    const profiles = await loadProfilesWithRelations(db, ids);

    // findMany() ignores the ordering above, so restore newest-first here.
    const position = new Map(ids.map((id, index) => [id, index]));
    return profiles.sort(
      (a, b) => (position.get(a.id) ?? 0) - (position.get(b.id) ?? 0)
    );
  });
}

/**
 * Ranked matches for the given filters. Bounded by
 * `EXPERT_DIRECTORY_LIMITS.maxScannedProfiles` — this never loads the whole
 * table, and callers cap again before rendering.
 */
export async function searchExperts(
  filters: DirectoryFilters
): Promise<ProfileWithRelations[]> {
  const conditions = [];

  if (filters.type === "individual") {
    conditions.push(eq(expertProfiles.profileType, "individual"));
  } else if (filters.type === "company") {
    conditions.push(eq(expertProfiles.profileType, "company"));
  }

  if (filters.location) {
    conditions.push(like(expertProfiles.location, `%${filters.location}%`));
  }

  const individualConditions = [];

  if (filters.type !== "company") {
    if (filters.minRate != null) {
      individualConditions.push(gte(expertProfiles.hourlyRate, filters.minRate));
    }
    if (filters.maxRate != null) {
      individualConditions.push(lte(expertProfiles.hourlyRate, filters.maxRate));
    }
    if (filters.availability) {
      individualConditions.push(
        eq(expertProfiles.availability, filters.availability)
      );
    }
  }

  if (individualConditions.length > 0) {
    if (filters.type === "individual") {
      conditions.push(...individualConditions);
    } else {
      // All: rate/availability apply to individuals only — companies still match.
      conditions.push(
        or(
          eq(expertProfiles.profileType, "company"),
          and(
            eq(expertProfiles.profileType, "individual"),
            ...individualConditions
          )
        )
      );
    }
  }

  const profiles = await fetchPublicProfiles(conditions);
  const filtered = filterProfiles(profiles, filters);
  return rankProfiles(filtered);
}

export async function incrementProfileViews(profileId: number): Promise<void> {
  const db = await getDb();
  await db
    .update(expertProfiles)
    .set({ profileViews: sql`${expertProfiles.profileViews} + 1` })
    .where(eq(expertProfiles.id, profileId));
}

export async function getFeaturedExperts(
  limit = 3
): Promise<ProfileWithRelations[]> {
  return withD1Retry("getFeaturedExperts", async () => {
    const db = await getDb();
    const where = publicExpertProfileConditions(
      eq(expertProfiles.featured, true)
    );

    const rows = await db
      .select({ id: expertProfiles.id })
      .from(expertProfiles)
      .innerJoin(users, eq(expertProfiles.userId, users.id))
      .where(where)
      .orderBy(desc(expertProfiles.createdAt))
      .limit(limit);

    const profiles = await loadProfilesWithRelations(
      db,
      rows.map((r) => r.id)
    );

    return rankProfiles(profiles);
  });
}

export async function getDirectoryStats() {
  const db = await getDb();
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(expertProfiles)
    .innerJoin(users, eq(expertProfiles.userId, users.id))
    .where(publicExpertProfileConditions());

  return { expertCount: row?.count ?? 0 };
}

export async function getProfileBySlug(
  slug: string
): Promise<ProfileWithRelations | null> {
  const db = await getDb();
  const row = await db
    .select({ profile: expertProfiles })
    .from(expertProfiles)
    .innerJoin(users, eq(expertProfiles.userId, users.id))
    .where(
      publicExpertProfileConditions(eq(expertProfiles.slug, slug))
    )
    .limit(1);

  const profileId = row[0]?.profile.id;
  if (!profileId) return null;

  const profile = await db.query.expertProfiles.findFirst({
    where: eq(expertProfiles.id, profileId),
    with: {
      skills: { with: { skill: true } },
      services: { with: { service: true } },
    },
  });

  return (profile as ProfileWithRelations | null) ?? null;
}

/** Owner dashboard — includes hidden/pending profiles for the signed-in user. */
export async function getProfileBySlugForOwner(
  slug: string,
  userId: number
): Promise<ProfileWithRelations | null> {
  const db = await getDb();
  const profile = await db.query.expertProfiles.findFirst({
    where: and(eq(expertProfiles.slug, slug), eq(expertProfiles.userId, userId)),
    with: {
      skills: { with: { skill: true } },
      services: { with: { service: true } },
    },
  });

  return (profile as ProfileWithRelations | null) ?? null;
}

/** Lightweight slug list for sitemap generation. */
export async function getPublicExpertSlugs(): Promise<
  { slug: string; updatedAt: string }[]
> {
  const db = await getDb();
  return db
    .select({
      slug: expertProfiles.slug,
      updatedAt: expertProfiles.updatedAt,
    })
    .from(expertProfiles)
    .innerJoin(users, eq(expertProfiles.userId, users.id))
    .where(publicExpertProfileConditions());
}

export async function getDistinctLocations(): Promise<string[]> {
  return withD1Retry("getDistinctLocations", async () => {
    const db = await getDb();
    const rows = await db
      .selectDistinct({ location: expertProfiles.location })
      .from(expertProfiles)
      .innerJoin(users, eq(expertProfiles.userId, users.id))
      .where(
        and(
          publicExpertProfileConditions(),
          isNotNull(expertProfiles.location)
        )
      );

    return rows
      .map((r) => r.location)
      .filter((loc): loc is string => !!loc && loc.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));
  });
}

export { PUBLIC_PROFILE_STATUS };
