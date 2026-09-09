import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { expertProfiles, users } from "@/db/schema";

const nowIso = () => new Date().toISOString();

/** Placeholder email — unique per internal user id, not deliverable. */
export function anonymisedEmail(userId: number): string {
  return `deleted-user-${userId}@deleted.aijobsmarket.local`;
}

export type UserDeletionResult = {
  userId: number;
  profileHidden: boolean;
};

/**
 * GDPR erasure workflow when Clerk deletes an account (`user.deleted` webhook).
 *
 * - Soft-deletes and anonymises the D1 user row (PII removed).
 * - Hides the expert profile from the public directory.
 * - Preserves conversations/messages for the other party (bodies may still
 *   contain PII — see docs/USER_DATA_ARCHITECTURE.md retention policy).
 */
export async function processUserDeletion(
  clerkUserId: string
): Promise<UserDeletionResult | null> {
  const db = await getDb();
  const ts = nowIso();

  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
    with: { profile: true },
  });

  if (!user) return null;

  await db
    .update(users)
    .set({
      email: anonymisedEmail(user.id),
      name: "Deleted User",
      marketingOptIn: false,
      unsubscribed: true,
      deletedAt: ts,
      updatedAt: ts,
    })
    .where(eq(users.id, user.id));

  let profileHidden = false;
  if (user.profile) {
    await db
      .update(expertProfiles)
      .set({
        status: "hidden",
        fullName: "Deleted expert",
        headline: null,
        bio: null,
        location: null,
        hourlyRate: null,
        availability: null,
        companySize: null,
        yearEstablished: null,
        linkedinUrl: null,
        githubUrl: null,
        websiteUrl: null,
        externalLinks: null,
        workExamples: null,
        profileImageUrl: null,
        updatedAt: ts,
      })
      .where(eq(expertProfiles.id, user.profile.id));
    profileHidden = true;
  }

  return { userId: user.id, profileHidden };
}
