import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  freelancerProfiles,
  freelancerServices,
  freelancerSkills,
  services,
  skills,
  type FreelancerProfile,
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
    const existing = await db.query.freelancerProfiles.findFirst({
      where: eq(freelancerProfiles.slug, candidate),
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
  freelancerId: number,
  skillIds: number[],
  serviceIds: number[]
) {
  const db = await getDb();

  await db
    .delete(freelancerSkills)
    .where(eq(freelancerSkills.freelancerId, freelancerId));
  await db
    .delete(freelancerServices)
    .where(eq(freelancerServices.freelancerId, freelancerId));

  if (skillIds.length > 0) {
    await db.insert(freelancerSkills).values(
      skillIds.map((skillId) => ({ freelancerId, skillId }))
    );
  }

  if (serviceIds.length > 0) {
    await db.insert(freelancerServices).values(
      serviceIds.map((serviceId) => ({ freelancerId, serviceId }))
    );
  }
}

export async function createProfile(userId: number, data: ProfileFormData) {
  const db = await getDb();
  const slug = await uniqueSlug(data.fullName);
  const now = new Date().toISOString();

  const [profile] = await db
    .insert(freelancerProfiles)
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
      updatedAt: now,
    })
    .returning();

  await syncSkillsAndServices(profile.id, data.skillIds, data.serviceIds);
  return profile;
}

export async function updateProfile(
  profile: FreelancerProfile,
  data: ProfileFormData
) {
  const db = await getDb();
  const slug =
    data.fullName !== profile.fullName
      ? await uniqueSlug(data.fullName, profile.id)
      : profile.slug;

  const now = new Date().toISOString();

  const [updated] = await db
    .update(freelancerProfiles)
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
    .where(eq(freelancerProfiles.id, profile.id))
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
