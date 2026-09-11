import { asc, eq } from "drizzle-orm";
import { getDb, withD1Retry } from "@/db/client";
import {
  expertProfiles,
  expertServices,
  expertSkills,
  services,
  skills,
  type ExpertProfile,
} from "@/db/schema";
import { parseProfileType } from "@/lib/profile-type";
import {
  mapTermsToIds,
  SERVICE_KEYWORDS,
  SKILL_KEYWORDS,
} from "@/lib/taxonomy-map";
import { slugify } from "@/lib/utils";
import type { ProfileFormData } from "@/lib/validations/profile";

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const db = await getDb();
  let slug = slugify(base);
  if (!slug) slug = "profile";

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

function serializeCustomTags(values: string[]): string | null {
  if (values.length === 0) return null;
  return JSON.stringify({ v: 2, tags: values });
}

function uniqueIds(ids: number[]): number[] {
  return [...new Set(ids)];
}

async function resolveProfileTaxonomy(data: ProfileFormData) {
  const [allSkills, allServices] = await Promise.all([
    getAllSkills(),
    getAllServices(),
  ]);
  return {
    skillIds: uniqueIds(
      mapTermsToIds(data.customSkills, allSkills, SKILL_KEYWORDS)
    ),
    serviceIds: uniqueIds(
      mapTermsToIds(data.customServices, allServices, SERVICE_KEYWORDS)
    ),
  };
}

function serializeExternalLinks(values: string[]): string | null {
  return values.length > 0 ? JSON.stringify(values) : null;
}

function serializeWorkExamples(
  values: ProfileFormData["workExamples"]
): string | null {
  return values.length > 0 ? JSON.stringify(values) : null;
}

function individualOnlyFields(data: ProfileFormData): {
  hourlyRate: number | null;
  availability: string | null;
} {
  if (parseProfileType(data.profileType) === "company") {
    return { hourlyRate: null, availability: null };
  }
  return {
    hourlyRate: emptyToNull(data.hourlyRate) as number | null,
    availability: emptyToNull(data.availability) as string | null,
  };
}

function companyOnlyFields(data: ProfileFormData): {
  companySize: string | null;
  yearEstablished: number | null;
} {
  if (parseProfileType(data.profileType) !== "company") {
    return {
      companySize: null,
      yearEstablished: null,
    };
  }

  return {
    companySize: emptyToNull(data.companySize) as string | null,
    yearEstablished: emptyToNull(data.yearEstablished) as number | null,
  };
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
  const profileType = parseProfileType(data.profileType);
  const { hourlyRate, availability } = individualOnlyFields({
    ...data,
    profileType,
  });
  const { companySize, yearEstablished } = companyOnlyFields({
    ...data,
    profileType,
  });
  const externalLinks = serializeExternalLinks(data.externalLinks);

  const [profile] = await db
    .insert(expertProfiles)
    .values({
      userId,
      slug,
      fullName: data.fullName,
      profileType,
      headline: emptyToNull(data.headline) as string | null,
      bio: emptyToNull(data.bio) as string | null,
      location: emptyToNull(data.location) as string | null,
      hourlyRate,
      availability,
      companySize,
      yearEstablished,
      linkedinUrl: emptyToNull(data.linkedinUrl) as string | null,
      githubUrl: emptyToNull(data.githubUrl) as string | null,
      websiteUrl: emptyToNull(data.websiteUrl) as string | null,
      externalLinks,
      profileImageUrl: emptyToNull(data.profileImageUrl) as string | null,
      customSkills: serializeCustomTags(data.customSkills),
      customServices: serializeCustomTags(data.customServices),
      workExamples: serializeWorkExamples(data.workExamples),
      status: "approved",
      updatedAt: now,
    })
    .returning();

  const { skillIds, serviceIds } = await resolveProfileTaxonomy(data);
  await syncSkillsAndServices(profile.id, skillIds, serviceIds);
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
  const profileType = parseProfileType(data.profileType);
  const { hourlyRate, availability } = individualOnlyFields({
    ...data,
    profileType,
  });
  const { companySize, yearEstablished } = companyOnlyFields({
    ...data,
    profileType,
  });
  const externalLinks = serializeExternalLinks(data.externalLinks);

  const [updated] = await db
    .update(expertProfiles)
    .set({
      slug,
      fullName: data.fullName,
      profileType,
      headline: emptyToNull(data.headline) as string | null,
      bio: emptyToNull(data.bio) as string | null,
      location: emptyToNull(data.location) as string | null,
      hourlyRate,
      availability,
      companySize,
      yearEstablished,
      linkedinUrl: emptyToNull(data.linkedinUrl) as string | null,
      githubUrl: emptyToNull(data.githubUrl) as string | null,
      websiteUrl: emptyToNull(data.websiteUrl) as string | null,
      externalLinks,
      profileImageUrl: emptyToNull(data.profileImageUrl) as string | null,
      customSkills: serializeCustomTags(data.customSkills),
      customServices: serializeCustomTags(data.customServices),
      workExamples: serializeWorkExamples(data.workExamples),
      updatedAt: now,
    })
    .where(eq(expertProfiles.id, profile.id))
    .returning();

  const { skillIds, serviceIds } = await resolveProfileTaxonomy(data);
  await syncSkillsAndServices(updated.id, skillIds, serviceIds);
  return updated;
}

export async function getAllSkills() {
  return withD1Retry("getAllSkills", async () => {
    const db = await getDb();
    return db.select().from(skills).orderBy(asc(skills.name));
  });
}

export async function getAllServices() {
  return withD1Retry("getAllServices", async () => {
    const db = await getDb();
    return db.select().from(services).orderBy(asc(services.name));
  });
}
