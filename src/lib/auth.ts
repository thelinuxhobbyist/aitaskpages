import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import {
  applyPendingMarketingOptIn,
  displayNameFromClerk,
  primaryEmailFromClerk,
  syncUserFromClerkSession,
  upsertUserFromClerk,
} from "@/lib/clerk-sync";
import { syncClerkEnvToProcess } from "@/lib/clerk-env";
import { sendWelcomeEmail, isEmailConfigured } from "@/lib/email";
import { MARKETING_OPT_IN_COOKIE } from "@/lib/marketing-preferences";

async function getUserWithProfile(clerkUserId: string) {
  const db = await getDb();
  return db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
    with: {
      profile: {
        with: {
          skills: { with: { skill: true } },
          services: { with: { service: true } },
        },
      },
    },
  });
}

/** Returns the D1 user row. Creates it only if the Clerk webhook has not run yet. */
export async function getOrCreateUser() {
  await syncClerkEnvToProcess();
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  const email =
    primaryEmailFromClerk({
      id: userId,
      first_name: clerkUser?.firstName,
      last_name: clerkUser?.lastName,
      username: clerkUser?.username,
      primary_email_address_id: clerkUser?.primaryEmailAddressId,
      email_addresses: clerkUser?.emailAddresses?.map((e) => ({
        id: e.id,
        email_address: e.emailAddress,
      })),
    }) ?? clerkUser?.emailAddresses[0]?.emailAddress;

  if (!email) return null;

  const name = displayNameFromClerk({
    id: userId,
    first_name: clerkUser?.firstName,
    last_name: clerkUser?.lastName,
    username: clerkUser?.username,
    email_addresses: clerkUser?.emailAddresses?.map((e) => ({
      id: e.id,
      email_address: e.emailAddress,
    })),
  });

  let existing = await getUserWithProfile(userId);

  if (existing?.deletedAt) {
    return null;
  }

  if (existing) {
    // Webhook is the source of truth for create/update; session sync is a light fallback.
    await syncUserFromClerkSession(userId, email, name);
    existing = await getUserWithProfile(userId);
  } else {
    const cookieStore = await cookies();
    const pendingOptIn =
      cookieStore.get(MARKETING_OPT_IN_COOKIE)?.value === "1";

    // Fallback when user.created webhook is delayed or failed.
    await upsertUserFromClerk(
      {
        id: userId,
        first_name: clerkUser?.firstName,
        last_name: clerkUser?.lastName,
        username: clerkUser?.username,
        primary_email_address_id: clerkUser?.primaryEmailAddressId,
        email_addresses: clerkUser?.emailAddresses?.map((e) => ({
          id: e.id,
          email_address: e.emailAddress,
        })),
      },
      { marketingOptIn: pendingOptIn }
    );

    if (pendingOptIn) {
      cookieStore.delete(MARKETING_OPT_IN_COOKIE);
    }

    if (isEmailConfigured()) {
      sendWelcomeEmail({
        to: email,
        name: clerkUser?.firstName ?? undefined,
      }).catch((err) => console.error("Welcome email failed:", err));
    }

    existing = await getUserWithProfile(userId);
  }

  if (existing && !existing.marketingOptIn) {
    const cookieStore = await cookies();
    if (cookieStore.get(MARKETING_OPT_IN_COOKIE)?.value === "1") {
      await applyPendingMarketingOptIn(existing.id);
      cookieStore.delete(MARKETING_OPT_IN_COOKIE);
      existing = await getUserWithProfile(userId);
    }
  }

  return existing ?? null;
}

/** Returns the Clerk user id if signed in, otherwise null. Never redirects. */
export async function getAuthUserId() {
  await syncClerkEnvToProcess();
  const { userId } = await auth();
  return userId;
}

export type AuthIdentity = {
  userId: string;
  email: string | null;
  name: string;
  emailVerified: boolean;
};

/**
 * Resolves the signed-in user's identity + email verification status from Clerk.
 * Returns null when signed out. Never redirects.
 */
export async function getAuthIdentity(): Promise<AuthIdentity | null> {
  await syncClerkEnvToProcess();
  const { userId } = await auth();
  if (!userId) return null;

  const account = await currentUser();
  const primary =
    account?.emailAddresses?.find(
      (e) => e.id === account.primaryEmailAddressId
    ) ?? account?.emailAddresses?.[0];

  const email = primary?.emailAddress ?? null;
  const emailVerified = primary?.verification?.status === "verified";
  const name =
    [account?.firstName, account?.lastName].filter(Boolean).join(" ") ||
    account?.username ||
    email ||
    "";

  return { userId, email, name, emailVerified };
}

/** Requires an authenticated user; redirects to sign-in if missing. */
export async function requireUser() {
  await syncClerkEnvToProcess();
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  return user;
}
