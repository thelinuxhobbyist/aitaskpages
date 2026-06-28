import { clerkClient } from "@clerk/nextjs/server";
import { desc, eq, isNull, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { expertProfiles, users } from "@/db/schema";
import { syncClerkEnvToProcess } from "@/lib/clerk-env";
import { isoTimestamp, toCsv, type UserExportRow, userExportHeaders, userExportToRow } from "@/lib/csv";

function accountType(
  role: string,
  hasProfile: boolean,
  deleted: boolean
): string {
  if (deleted) return "Deleted";
  if (role === "admin") return "Admin";
  if (hasProfile) return "Expert";
  return "Client";
}

async function fetchClerkLastSignInMap(): Promise<Map<string, string>> {
  await syncClerkEnvToProcess();
  const client = await clerkClient();
  const map = new Map<string, string>();
  const limit = 100;
  let offset = 0;

  while (true) {
    const { data, totalCount } = await client.users.getUserList({
      limit,
      offset,
    });

    for (const user of data) {
      map.set(user.id, isoTimestamp(user.lastSignInAt));
    }

    offset += data.length;
    if (data.length === 0 || offset >= totalCount) break;
  }

  return map;
}

export async function getUsersExportRows(opts?: {
  includeDeleted?: boolean;
}): Promise<UserExportRow[]> {
  const db = await getDb();

  const baseQuery = db
    .select({
      userId: users.id,
      clerkUserId: users.clerkUserId,
      email: users.email,
      name: users.name,
      role: users.role,
      plan: users.plan,
      marketingOptIn: users.marketingOptIn,
      unsubscribed: users.unsubscribed,
      registeredAt: users.createdAt,
      lastUpdated: users.updatedAt,
      deletedAt: users.deletedAt,
      profileId: expertProfiles.id,
      expertProfileName: expertProfiles.fullName,
      expertSlug: expertProfiles.slug,
      expertLocation: expertProfiles.location,
      expertProfileCreatedAt: expertProfiles.createdAt,
      expertProfileStatus: sql<string | null>`freelancer_profiles.status`,
    })
    .from(users)
    .leftJoin(expertProfiles, eq(expertProfiles.userId, users.id));

  const rows = await (opts?.includeDeleted
    ? baseQuery.orderBy(desc(users.createdAt))
    : baseQuery
        .where(isNull(users.deletedAt))
        .orderBy(desc(users.createdAt)));

  let lastSignInByClerkId = new Map<string, string>();
  try {
    lastSignInByClerkId = await fetchClerkLastSignInMap();
  } catch (err) {
    console.error("Clerk last sign-in lookup failed; export continues without it:", err);
  }

  return rows.map((row) => {
    const hasProfile = row.profileId != null;
    const deleted = row.deletedAt != null;

    return {
      userId: row.userId,
      email: row.email,
      name: row.name ?? "",
      accountType: accountType(row.role, hasProfile, deleted),
      registeredAt: row.registeredAt,
      lastLogin: lastSignInByClerkId.get(row.clerkUserId) ?? "",
      lastUpdated: row.lastUpdated ?? row.registeredAt,
      hasExpertProfile: hasProfile,
      expertProfileName: row.expertProfileName ?? "",
      expertSlug: row.expertSlug ?? "",
      expertLocation: row.expertLocation ?? "",
      expertProfileStatus: row.expertProfileStatus ?? "",
      expertProfileCreatedAt: row.expertProfileCreatedAt ?? "",
      marketingOptIn: row.marketingOptIn,
      unsubscribed: row.unsubscribed,
      plan: row.plan,
      role: row.role,
      accountStatus: deleted ? "deleted" : "active",
      clerkUserId: row.clerkUserId,
    };
  });
}

export async function buildUsersExportCsv(opts?: {
  includeDeleted?: boolean;
}): Promise<string> {
  const rows = await getUsersExportRows(opts);
  return toCsv(
    userExportHeaders(),
    rows.map((row) => userExportToRow(row))
  );
}
