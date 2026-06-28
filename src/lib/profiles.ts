import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  expertProfiles,
  expertServices,
  expertSkills,
  services,
  skills,
  type ExpertProfile,
} from "@/db/schema";
import { slugify } from "@/lib/utils";
import type { ProfileFormData } from "@/lib/validations/profile";

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const db = await getDb();
  let slug = slugify(base);
  if (!slug) slug = "expert";

  let candidate = slug;
  let n = 2;

  while (true) {
    const existing = await db.query.expertProfiles.findFirst({
      where: eq(expertProfiles.slug, candidate),
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${slug}-${n++}`;
  }
}

function emptyToNull(value: string | number | undefined): string | number | null {
  if (value === "" || value === undefined) return null;
  return value;
}

async function syncSkillsAndServices(
  expertId: number,
  skillIds: number[],
  serviceIds: number[]
) {
  const db = await getDb();

  await db
    .delete(expertSkills)
    .where(eq(expertSkills.expertId, expertId));
  await db
    .delete(expertServices)
    .where(eq(expertServices.expertId, expertId));

  if (skillIds.length > 0) {
    await db.insert(expertSkills).values(
      skillIds.map((skillId) => ({ expertId, skillId }))
    );
  }

  if (serviceIds.length > 0) {
    await db.insert(expertServices).values(
      serviceIds.map((serviceId) => ({ expertId, serviceId }))
    );
  }
}

export async function createProfile(userId: number, data: ProfileFormData) {
  const db = await getDb();
  const slug = await uniqueSlug(data.fullName);
  const now = new Date().toISOString();

  const [profile] = await db
    .insert(expertProfiles)
    .values({
      userId,
      slug,
      fullName: data.fullName,
      headline: emptyToNull(data.headline) as string | null,
      bio: emptyToNull(data.bio) as string | null,
      location: emptyToNull(data.location) as string | null,
      hourlyRate: emptyToNull(data.hourlyRate) as number | null,
      availability: emptyToNull(data.availability) as string | null,
      linkedinUrl: emptyToNull(data.linkedinUrl) as string | null,
      githubUrl: emptyToNull(data.githubUrl) as string | null,
      websiteUrl: emptyToNull(data.websiteUrl) as string | null,
      profileImageUrl: emptyToNull(data.profileImageUrl) as string | null,
      status: "approved",
      updatedAt: now,
    })
    .returning();

  await syncSkillsAndServices(profile.id, data.skillIds, data.serviceIds);
  return profile;
}

export async function updateProfile(
  profile: ExpertProfile,
  data: ProfileFormData
) {
  const db = await getDb();
  const slug =
    data.fullName !== profile.fullName
      ? await uniqueSlug(data.fullName, profile.id)
      : profile.slug;

  const now = new Date().toISOString();

  const [updated] = await db
    .update(expertProfiles)
    .set({
      slug,
      fullName: data.fullName,
      headline: emptyToNull(data.headline) as string | null,
      bio: emptyToNull(data.bio) as string | null,
      location: emptyToNull(data.location) as string | null,
      hourlyRate: emptyToNull(data.hourlyRate) as number | null,
      availability: emptyToNull(data.availability) as string | null,
      linkedinUrl: emptyToNull(data.linkedinUrl) as string | null,
      githubUrl: emptyToNull(data.githubUrl) as string | null,
      websiteUrl: emptyToNull(data.websiteUrl) as string | null,
      profileImageUrl: emptyToNull(data.profileImageUrl) as string | null,
      updatedAt: now,
    })
    .where(eq(expertProfiles.id, profile.id))
    .returning();

  await syncSkillsAndServices(updated.id, data.skillIds, data.serviceIds);
  return updated;
}

export async function getAllSkills() {
  const db = await getDb();
  return db.select().from(skills).orderBy(asc(skills.name));
}

export async function getAllServices() {
  const db = await getDb();
  return db.select().from(services).orderBy(asc(services.name));
}
