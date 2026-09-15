import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  expertProfiles,
  expertServices,
  expertSkills,
  requirementInterests,
  requirementNotifications,
  requirementServices,
  requirementSkills,
  requirements,
  users,
  type Requirement,
  type RequirementStatus,
} from "@/db/schema";
import {
  isEmailConfigured,
  sendNewRequirementMatchEmail,
  sendRequirementInterestEmail,
} from "@/lib/email";
import { publicExpertProfileConditions } from "@/lib/directory-filters";
import { parseCustomServices, parseCustomSkills } from "@/lib/profile-utils";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { interestedExpertsUrl, requirementUrl } from "@/lib/site";
import {
  getRequirementCompanyLabel,
  toPublicSummary,
  type PublicRequirementSummary,
} from "@/lib/requirement-utils";
import {
  mapTermsToIds,
  SERVICE_KEYWORDS,
  SKILL_KEYWORDS,
} from "@/lib/taxonomy-map";
import type { RequirementFormData } from "@/lib/validations/requirement";

export type RequirementWithRelations = Requirement & {
  skills: { skill: { id: number; name: string; slug: string } }[];
  services: { service: { id: number; name: string; slug: string } }[];
  client?: { id: number; name: string | null; email: string };
  interests?: { id: number; createdAt: string }[];
};

export type RequirementListItem = PublicRequirementSummary & {
  status: RequirementStatus;
  interestCount: number;
  hasInterest?: boolean;
};

export type InterestedExpert = {
  interestId: number;
  expertId: number;
  slug: string;
  fullName: string;
  headline: string | null;
  location: string | null;
  hourlyRate: number | null;
  hourlyRateCurrency: string | null;
  profileImageUrl: string | null;
  message: string | null;
  createdAt: string;
  skillNames: string[];
  serviceNames: string[];
};

const requirementWithRelations = {
  skills: { with: { skill: true } },
  services: { with: { service: true } },
  client: true,
} as const;

function serializeCustomTags(values: string[]): string | null {
  return values.length > 0 ? JSON.stringify(values) : null;
}

function uniqueIds(ids: number[]): number[] {
  return [...new Set(ids)];
}

async function resolveRequirementTaxonomy(data: RequirementFormData) {
  const [allSkills, allServices] = await Promise.all([
    getAllSkills(),
    getAllServices(),
  ]);
  const terms = [...data.customSkills, ...data.customServices];
  return {
    skillIds: uniqueIds(mapTermsToIds(terms, allSkills, SKILL_KEYWORDS)),
    serviceIds: uniqueIds(mapTermsToIds(terms, allServices, SERVICE_KEYWORDS)),
  };
}

function hasTypedExpertise(data: RequirementFormData): boolean {
  return data.customSkills.length > 0 || data.customServices.length > 0;
}

function storedRequirementHasExpertise(
  existing: RequirementWithRelations
): boolean {
  return (
    parseCustomSkills(existing.customSkills).length > 0 ||
    parseCustomServices(existing.customServices).length > 0 ||
    existing.skills.length > 0 ||
    existing.services.length > 0
  );
}

async function syncRequirementTaxonomy(
  requirementId: number,
  skillIds: number[],
  serviceIds: number[]
) {
  const db = await getDb();

  await db
    .delete(requirementSkills)
    .where(eq(requirementSkills.requirementId, requirementId));
  await db
    .delete(requirementServices)
    .where(eq(requirementServices.requirementId, requirementId));

  if (skillIds.length > 0) {
    await db.insert(requirementSkills).values(
      skillIds.map((skillId) => ({ requirementId, skillId }))
    );
  }

  if (serviceIds.length > 0) {
    await db.insert(requirementServices).values(
      serviceIds.map((serviceId) => ({ requirementId, serviceId }))
    );
  }
}

function toListItem(
  req: RequirementWithRelations,
  interestCount: number,
  hasInterest?: boolean
): RequirementListItem {
  return {
    ...toPublicSummary(req),
    status: req.status,
    interestCount,
    hasInterest,
  };
}

export async function getRequirementById(
  id: number
): Promise<RequirementWithRelations | null> {
  const db = await getDb();
  const row = await db.query.requirements.findFirst({
    where: eq(requirements.id, id),
    with: requirementWithRelations,
  });
  return row ?? null;
}

export async function createRequirement(
  clientUserId: number,
  data: RequirementFormData,
  publish: boolean
): Promise<number> {
  if (publish && !hasTypedExpertise(data)) {
    throw new Error(
      "Add the expertise or kind of help you need so matching experts can be notified."
    );
  }

  const { skillIds, serviceIds } = await resolveRequirementTaxonomy(data);
  const db = await getDb();
  const now = new Date().toISOString();

  const [row] = await db
    .insert(requirements)
    .values({
      clientUserId,
      title: data.title,
      description: data.description,
      companyName: data.companyName.trim(),
      businessType: "other",
      budget: data.budget || null,
      location: data.location || null,
      remoteOk: data.remoteOk,
      customSkills: serializeCustomTags(data.customSkills),
      customServices: serializeCustomTags(data.customServices),
      status: publish ? "open" : "draft",
      updatedAt: now,
    })
    .returning({ id: requirements.id });

  await syncRequirementTaxonomy(row.id, skillIds, serviceIds);

  if (publish) {
    await notifyMatchingExperts(row.id);
  }

  return row.id;
}

export async function updateRequirement(
  id: number,
  clientUserId: number,
  data: RequirementFormData
): Promise<void> {
  const db = await getDb();
  const existing = await getRequirementById(id);

  if (!existing || existing.clientUserId !== clientUserId) {
    throw new Error("Requirement not found.");
  }

  if (existing.status !== "draft" && existing.status !== "open") {
    throw new Error("This requirement can no longer be edited.");
  }

  const { skillIds, serviceIds } = await resolveRequirementTaxonomy(data);

  await db
    .update(requirements)
    .set({
      title: data.title,
      description: data.description,
      companyName: data.companyName.trim(),
      businessType: "other",
      budget: data.budget || null,
      location: data.location || null,
      remoteOk: data.remoteOk,
      customSkills: serializeCustomTags(data.customSkills),
      customServices: serializeCustomTags(data.customServices),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(requirements.id, id));

  await syncRequirementTaxonomy(id, skillIds, serviceIds);
}

export async function publishRequirement(
  id: number,
  clientUserId: number
): Promise<void> {
  const db = await getDb();
  const existing = await getRequirementById(id);

  if (!existing || existing.clientUserId !== clientUserId) {
    throw new Error("Requirement not found.");
  }

  if (existing.status !== "draft") {
    throw new Error("Only drafts can be published.");
  }

  if (!storedRequirementHasExpertise(existing)) {
    throw new Error(
      "Add the expertise or kind of help you need before publishing."
    );
  }

  await db
    .update(requirements)
    .set({ status: "open", updatedAt: new Date().toISOString() })
    .where(eq(requirements.id, id));

  await notifyMatchingExperts(id);
}

export async function deleteRequirement(
  id: number,
  clientUserId: number
): Promise<void> {
  const existing = await getRequirementById(id);

  if (!existing || existing.clientUserId !== clientUserId) {
    throw new Error("Requirement not found.");
  }

  const db = await getDb();
  // D1 does not always enforce ON DELETE CASCADE, so clear related rows first.
  await db
    .delete(requirementInterests)
    .where(eq(requirementInterests.requirementId, id));
  await db
    .delete(requirementNotifications)
    .where(eq(requirementNotifications.requirementId, id));
  await db
    .delete(requirementSkills)
    .where(eq(requirementSkills.requirementId, id));
  await db
    .delete(requirementServices)
    .where(eq(requirementServices.requirementId, id));
  await db.delete(requirements).where(eq(requirements.id, id));
}

export async function closeRequirement(
  id: number,
  clientUserId: number,
  status: "closed" | "filled" = "closed"
): Promise<void> {
  const db = await getDb();
  const existing = await getRequirementById(id);

  if (!existing || existing.clientUserId !== clientUserId) {
    throw new Error("Requirement not found.");
  }

  if (existing.status !== "open") {
    throw new Error("Only open requirements can be closed.");
  }

  await db
    .update(requirements)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(requirements.id, id));
}

export async function getClientRequirements(
  clientUserId: number
): Promise<RequirementListItem[]> {
  const db = await getDb();
  const rows = await db.query.requirements.findMany({
    where: eq(requirements.clientUserId, clientUserId),
    with: requirementWithRelations,
    orderBy: [desc(requirements.createdAt)],
  });

  const items: RequirementListItem[] = [];
  for (const row of rows) {
    const [countRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(requirementInterests)
      .where(eq(requirementInterests.requirementId, row.id));
    items.push(toListItem(row, countRow?.count ?? 0));
  }
  return items;
}

/** Lightweight id list for sitemap generation. */
export async function getOpenRequirementIdsForSitemap(): Promise<
  { id: number; updatedAt: string }[]
> {
  const db = await getDb();
  return db
    .select({
      id: requirements.id,
      updatedAt: requirements.updatedAt,
    })
    .from(requirements)
    .where(eq(requirements.status, "open"));
}

/** All open requirements for the public directory (newest first). */
export async function getOpenRequirements(): Promise<PublicRequirementSummary[]> {
  const db = await getDb();
  const rows = await db.query.requirements.findMany({
    where: eq(requirements.status, "open"),
    with: requirementWithRelations,
    orderBy: [desc(requirements.createdAt)],
  });

  return rows.map((row) => toPublicSummary(row));
}

/** Recent open requirements for homepage showcase. */
export async function getLatestOpenRequirements(
  limit = 6
): Promise<PublicRequirementSummary[]> {
  const db = await getDb();
  const rows = await db.query.requirements.findMany({
    where: eq(requirements.status, "open"),
    with: requirementWithRelations,
    orderBy: [desc(requirements.createdAt)],
    limit,
  });
  return rows.map((row) => toPublicSummary(row));
}

/** Open requirements matching an expert's skills or services. */
export async function getMatchingOpportunities(
  expertId: number
): Promise<RequirementListItem[]> {
  const db = await getDb();

  const expert = await db.query.expertProfiles.findFirst({
    where: eq(expertProfiles.id, expertId),
    columns: { id: true, userId: true },
  });
  if (!expert) return [];

  const [expertSkillRows, expertServiceRows] = await Promise.all([
    db.query.expertSkills.findMany({
      where: eq(expertSkills.expertId, expertId),
    }),
    db.query.expertServices.findMany({
      where: eq(expertServices.expertId, expertId),
    }),
  ]);

  const skillIds = expertSkillRows.map((r) => r.skillId);
  const serviceIds = expertServiceRows.map((r) => r.serviceId);

  if (skillIds.length === 0 && serviceIds.length === 0) {
    return [];
  }

  const matchingIds = new Set<number>();

  if (skillIds.length > 0) {
    const skillMatches = await db
      .select({ requirementId: requirementSkills.requirementId })
      .from(requirementSkills)
      .where(inArray(requirementSkills.skillId, skillIds));
    for (const row of skillMatches) matchingIds.add(row.requirementId);
  }

  if (serviceIds.length > 0) {
    const serviceMatches = await db
      .select({ requirementId: requirementServices.requirementId })
      .from(requirementServices)
      .where(inArray(requirementServices.serviceId, serviceIds));
    for (const row of serviceMatches) matchingIds.add(row.requirementId);
  }

  if (matchingIds.size === 0) return [];

  const rows = await db.query.requirements.findMany({
    where: and(
      eq(requirements.status, "open"),
      inArray(requirements.id, [...matchingIds]),
      ne(requirements.clientUserId, expert.userId)
    ),
    with: requirementWithRelations,
    orderBy: [desc(requirements.createdAt)],
  });

  const existingInterests = await db.query.requirementInterests.findMany({
    where: and(
      eq(requirementInterests.expertId, expertId),
      inArray(requirementInterests.requirementId, [...matchingIds])
    ),
  });
  const interestedSet = new Set(
    existingInterests.map((i) => i.requirementId)
  );

  const items: RequirementListItem[] = [];
  for (const row of rows) {
    const [countRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(requirementInterests)
      .where(eq(requirementInterests.requirementId, row.id));
    items.push(toListItem(row, countRow?.count ?? 0, interestedSet.has(row.id)));
  }
  return items;
}

export async function hasExpertInterest(
  requirementId: number,
  expertId: number
): Promise<boolean> {
  const db = await getDb();
  const row = await db.query.requirementInterests.findFirst({
    where: and(
      eq(requirementInterests.requirementId, requirementId),
      eq(requirementInterests.expertId, expertId)
    ),
  });
  return !!row;
}

export async function expressInterest(params: {
  requirementId: number;
  expertId: number;
  expertUserId: number;
  message?: string;
}): Promise<void> {
  const db = await getDb();
  const req = await getRequirementById(params.requirementId);

  if (!req) throw new Error("Requirement not found.");
  if (req.status !== "open") {
    throw new Error("This requirement is no longer accepting interest.");
  }
  if (req.clientUserId === params.expertUserId) {
    throw new Error("You cannot express interest in your own requirement.");
  }

  const profileRow = await db
    .select({ profile: expertProfiles })
    .from(expertProfiles)
    .innerJoin(users, eq(expertProfiles.userId, users.id))
    .where(
      publicExpertProfileConditions(
        and(
          eq(expertProfiles.id, params.expertId),
          eq(expertProfiles.userId, params.expertUserId)
        )
      )
    )
    .limit(1);

  const profileId = profileRow[0]?.profile.id;
  if (!profileId) {
    throw new Error("Expert profile not found.");
  }

  const profile = await db.query.expertProfiles.findFirst({
    where: eq(expertProfiles.id, profileId),
    with: { user: true },
  });

  if (!profile) {
    throw new Error("Expert profile not found.");
  }

  const existing = await db.query.requirementInterests.findFirst({
    where: and(
      eq(requirementInterests.requirementId, params.requirementId),
      eq(requirementInterests.expertId, params.expertId)
    ),
  });

  if (existing) {
    throw new Error("You have already expressed interest in this requirement.");
  }

  await db.insert(requirementInterests).values({
    requirementId: params.requirementId,
    expertId: params.expertId,
    message: params.message ?? null,
  });

  if (isEmailConfigured() && req.client?.email) {
    try {
      await sendRequirementInterestEmail({
        to: req.client.email,
        businessName: req.client.name || req.client.email,
        requirementTitle: req.title,
        expertName: profile.fullName,
        interestedExpertsUrl: interestedExpertsUrl(params.requirementId),
      });
    } catch (err) {
      console.error("Requirement interest email failed:", err);
    }
  }
}

export async function getInterestedExperts(
  requirementId: number,
  clientUserId: number
): Promise<InterestedExpert[]> {
  const req = await getRequirementById(requirementId);
  if (!req || req.clientUserId !== clientUserId) {
    throw new Error("Requirement not found.");
  }

  const db = await getDb();
  const rows = await db.query.requirementInterests.findMany({
    where: eq(requirementInterests.requirementId, requirementId),
    with: {
      expert: {
        with: {
          skills: { with: { skill: true } },
          services: { with: { service: true } },
        },
      },
    },
    orderBy: [desc(requirementInterests.createdAt)],
  });

  return rows.map((row) => ({
    interestId: row.id,
    expertId: row.expert.id,
    slug: row.expert.slug,
    fullName: row.expert.fullName,
    headline: row.expert.headline,
    location: row.expert.location,
    hourlyRate: row.expert.hourlyRate,
    hourlyRateCurrency: row.expert.hourlyRateCurrency,
    profileImageUrl: row.expert.profileImageUrl,
    message: row.message,
    createdAt: row.createdAt,
    skillNames: row.expert.skills.map((s) => s.skill.name),
    serviceNames: row.expert.services.map((s) => s.service.name),
  }));
}

/** Notify experts whose skills/services overlap with the requirement. */
export async function notifyMatchingExperts(requirementId: number): Promise<void> {
  const db = await getDb();
  const req = await getRequirementById(requirementId);
  if (!req || req.status !== "open") return;

  const skillIds = req.skills.map((s) => s.skill.id);
  const serviceIds = req.services.map((s) => s.service.id);
  if (skillIds.length === 0 && serviceIds.length === 0) return;

  const matchingExpertIds = new Set<number>();

  if (skillIds.length > 0) {
    const rows = await db
      .select({ expertId: expertSkills.expertId })
      .from(expertSkills)
      .where(inArray(expertSkills.skillId, skillIds));
    for (const row of rows) matchingExpertIds.add(row.expertId);
  }

  if (serviceIds.length > 0) {
    const rows = await db
      .select({ expertId: expertServices.expertId })
      .from(expertServices)
      .where(inArray(expertServices.serviceId, serviceIds));
    for (const row of rows) matchingExpertIds.add(row.expertId);
  }

  if (matchingExpertIds.size === 0) return;

  const alreadyNotified = await db.query.requirementNotifications.findMany({
    where: eq(requirementNotifications.requirementId, requirementId),
  });
  const notifiedSet = new Set(alreadyNotified.map((n) => n.expertId));

  const expertRows = await db
    .select({ profile: expertProfiles })
    .from(expertProfiles)
    .innerJoin(users, eq(expertProfiles.userId, users.id))
    .where(
      publicExpertProfileConditions(
        inArray(expertProfiles.id, [...matchingExpertIds])
      )
    );

  for (const { profile: expert } of expertRows) {
    const expertUser = await db.query.users.findFirst({
      where: eq(users.id, expert.userId),
    });
    if (!expertUser) continue;

    if (expertUser.id === req.clientUserId) continue;
    if (notifiedSet.has(expert.id)) continue;
    if (!expertUser.email || expertUser.deletedAt) continue;

    await db.insert(requirementNotifications).values({
      requirementId,
      expertId: expert.id,
    });

    if (isEmailConfigured()) {
      try {
        await sendNewRequirementMatchEmail({
          to: expertUser.email,
          expertName: expert.fullName,
          requirementTitle: req.title,
          companyName: getRequirementCompanyLabel(
            req.companyName,
            req.businessType
          ),
          requirementUrl: requirementUrl(requirementId),
        });
      } catch (err) {
        console.error("Requirement match email failed:", err);
      }
    }
  }
}

export async function getRequirementInterestCount(
  requirementId: number
): Promise<number> {
  const db = await getDb();
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(requirementInterests)
    .where(eq(requirementInterests.requirementId, requirementId));
  return row?.count ?? 0;
}

export async function countOpenRequirementsForExpert(
  expertId: number
): Promise<number> {
  const opportunities = await getMatchingOpportunities(expertId);
  return opportunities.filter((o) => !o.hasInterest).length;
}

export async function countRequirementsWithNewInterest(
  clientUserId: number
): Promise<number> {
  const db = await getDb();
  const result = await db
    .select({ count: sql<number>`count(distinct ${requirementInterests.id})` })
    .from(requirementInterests)
    .innerJoin(
      requirements,
      eq(requirementInterests.requirementId, requirements.id)
    )
    .where(
      and(
        eq(requirements.clientUserId, clientUserId),
        eq(requirements.status, "open")
      )
    );
  return result[0]?.count ?? 0;
}
