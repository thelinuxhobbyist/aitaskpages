import { and, desc, eq, gte, inArray, isNotNull, like, lte, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { expertProfiles, users } from "@/db/schema";
import {
  PUBLIC_PROFILE_STATUS,
  publicExpertProfileConditions,
} from "@/lib/directory-filters";
import {
  rankProfiles,
  type ProfileWithRelations,
} from "@/lib/profile-utils";
import { filterProfiles } from "@/lib/search-utils";
import type { DirectoryFilters } from "@/lib/validations/directory";

async function fetchPublicProfiles(
  extraConditions: ReturnType<typeof and>[] = []
): Promise<ProfileWithRelations[]> {
  const db = await getDb();
  const where = publicExpertProfileConditions(
    extraConditions.length > 0 ? and(...extraConditions) : undefined
  );

  const rows = await db
    .select({ profile: expertProfiles })
    .from(expertProfiles)
    .innerJoin(users, eq(expertProfiles.userId, users.id))
    .where(where);

  const ids = rows.map((r) => r.profile.id);
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

export async function searchExperts(
  filters: DirectoryFilters
): Promise<ProfileWithRelations[]> {
  const conditions = [];

  if (filters.location) {
    conditions.push(like(expertProfiles.location, `%${filters.location}%`));
  }

  if (filters.minRate != null) {
    conditions.push(gte(expertProfiles.hourlyRate, filters.minRate));
  }

  if (filters.maxRate != null) {
    conditions.push(lte(expertProfiles.hourlyRate, filters.maxRate));
  }

  if (filters.availability) {
    conditions.push(eq(expertProfiles.availability, filters.availability));
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

  if (rows.length === 0) return [];

  const profiles = await db.query.expertProfiles.findMany({
    where: inArray(
      expertProfiles.id,
      rows.map((r) => r.id)
    ),
    with: {
      skills: { with: { skill: true } },
      services: { with: { service: true } },
    },
  });

  return rankProfiles(profiles as ProfileWithRelations[]);
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
}

export { PUBLIC_PROFILE_STATUS };
