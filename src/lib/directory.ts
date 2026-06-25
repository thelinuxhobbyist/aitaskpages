import { and, desc, eq, gte, isNotNull, like, lte, or, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { freelancerProfiles } from "@/db/schema";
import {
  rankProfiles,
  type ProfileWithRelations,
} from "@/lib/profile-utils";
import type { DirectoryFilters } from "@/lib/validations/directory";

export async function searchFreelancers(
  filters: DirectoryFilters
): Promise<ProfileWithRelations[]> {
  const db = getDb();
  const conditions = [];

  if (filters.q) {
    const term = `%${filters.q}%`;
    conditions.push(
      or(
        like(freelancerProfiles.fullName, term),
        like(freelancerProfiles.headline, term),
        like(freelancerProfiles.bio, term)
      )
    );
  }

  if (filters.location) {
    conditions.push(
      like(freelancerProfiles.location, `%${filters.location}%`)
    );
  }

  if (filters.minRate != null) {
    conditions.push(gte(freelancerProfiles.hourlyRate, filters.minRate));
  }

  if (filters.maxRate != null) {
    conditions.push(lte(freelancerProfiles.hourlyRate, filters.maxRate));
  }

  let profiles = await db.query.freelancerProfiles.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      skills: { with: { skill: true } },
      services: { with: { service: true } },
    },
  });

  if (filters.skill) {
    profiles = profiles.filter((p) =>
      p.skills.some((s) => s.skill.slug === filters.skill)
    );
  }

  if (filters.service) {
    profiles = profiles.filter((p) =>
      p.services.some((s) => s.service.slug === filters.service)
    );
  }

  return rankProfiles(profiles as ProfileWithRelations[]);
}

export async function incrementProfileViews(profileId: number): Promise<void> {
  const db = getDb();
  await db
    .update(freelancerProfiles)
    .set({ profileViews: sql`${freelancerProfiles.profileViews} + 1` })
    .where(eq(freelancerProfiles.id, profileId));
}

export async function getFeaturedFreelancers(
  limit = 3
): Promise<ProfileWithRelations[]> {
  const db = getDb();
  const profiles = await db.query.freelancerProfiles.findMany({
    where: eq(freelancerProfiles.featured, true),
    with: {
      skills: { with: { skill: true } },
      services: { with: { service: true } },
    },
    orderBy: [desc(freelancerProfiles.createdAt)],
    limit,
  });

  return rankProfiles(profiles as ProfileWithRelations[]);
}

export async function getDirectoryStats() {
  const db = getDb();
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(freelancerProfiles);

  return { expertCount: row?.count ?? 0 };
}

export async function getProfileBySlug(
  slug: string
): Promise<ProfileWithRelations | null> {
  const db = getDb();
  const profile = await db.query.freelancerProfiles.findFirst({
    where: eq(freelancerProfiles.slug, slug),
    with: {
      skills: { with: { skill: true } },
      services: { with: { service: true } },
    },
  });

  return (profile as ProfileWithRelations | null) ?? null;
}

export async function getDistinctLocations(): Promise<string[]> {
  const db = getDb();
  const rows = await db
    .selectDistinct({ location: freelancerProfiles.location })
    .from(freelancerProfiles)
    .where(isNotNull(freelancerProfiles.location));

  return rows
    .map((r) => r.location)
    .filter((loc): loc is string => !!loc && loc.trim().length > 0)
    .sort((a, b) => a.localeCompare(b));
}
