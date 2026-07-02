import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import {
  applyPendingMarketingOptIn,
  displayNameFromClerk,
  primaryEmailFromClerk,
  upsertUserFromClerk,
  type ClerkUserPayload,
} from "@/lib/clerk-sync";
import { syncClerkEnvToProcess } from "@/lib/clerk-env";
import { sendWelcomeEmail, isEmailConfigured } from "@/lib/email";
import { MARKETING_OPT_IN_COOKIE } from "@/lib/marketing-preferences";

type SafeAuth = {
  userId: string | null;
  sessionClaims: Record<string, unknown> | null;
};

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timeoutId = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

/** auth() only works on routes listed in middleware — never throw to callers. */
async function safeGetAuth(): Promise<SafeAuth> {
  try {
    await syncClerkEnvToProcess();
    const result = await auth();
    const sessionClaims =
      result.sessionClaims && typeof result.sessionClaims === "object"
        ? (result.sessionClaims as Record<string, unknown>)
        : null;
    return { userId: result.userId ?? null, sessionClaims };
  } catch (err) {
    console.error("Clerk auth() failed (route may be outside middleware matcher):", err);
    return { userId: null, sessionClaims: null };
  }
}

async function fetchUserWithProfile(clerkUserId: string) {
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

const getUserWithProfile = cache(fetchUserWithProfile);

function payloadFromSessionClaims(
  userId: string,
  claims: Record<string, unknown>
): ClerkUserPayload | null {
  const email =
    (typeof claims.email === "string" && claims.email) ||
    (typeof claims.primary_email_address === "string" &&
      claims.primary_email_address) ||
    null;

  if (!email) return null;

  return {
    id: userId,
    first_name:
      typeof claims.first_name === "string" ? claims.first_name : null,
    last_name: typeof claims.last_name === "string" ? claims.last_name : null,
    username: typeof claims.username === "string" ? claims.username : null,
    primary_email_address_id: null,
    email_addresses: [{ id: "session", email_address: email }],
  };
}

async function fetchClerkPayload(
  userId: string,
  sessionClaims: Record<string, unknown> | null | undefined
): Promise<ClerkUserPayload | null> {
  if (sessionClaims) {
    const fromClaims = payloadFromSessionClaims(userId, sessionClaims);
    if (fromClaims) return fromClaims;
  }

  try {
    await syncClerkEnvToProcess();
    const client = await clerkClient();
    const user = await withTimeout(client.users.getUser(userId), 4000, null);
    if (!user) return null;
    return {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      primary_email_address_id: user.primaryEmailAddressId,
      email_addresses: user.emailAddresses.map((e) => ({
        id: e.id,
        email_address: e.emailAddress,
      })),
    };
  } catch (err) {
    console.error("Clerk Backend API user fetch failed:", err);
    return null;
  }
}

/** Returns the D1 user row. Webhook is primary; API fallback on first sign-in. */
export const getOrCreateUser = cache(async () => {
  const { userId, sessionClaims } = await safeGetAuth();
  if (!userId) return null;

  let existing = await getUserWithProfile(userId);
  if (existing?.deletedAt) return null;
  if (existing) return existing;

  const payload = await fetchClerkPayload(userId, sessionClaims);
  const email = payload ? primaryEmailFromClerk(payload) : null;
  if (!email || !payload) {
    console.error("No email for Clerk user (webhook/API sync failed):", userId);
    return null;
  }

  const cookieStore = await cookies();
  const pendingOptIn =
    cookieStore.get(MARKETING_OPT_IN_COOKIE)?.value === "1";

  await upsertUserFromClerk(payload, { marketingOptIn: pendingOptIn });

  if (pendingOptIn) {
    cookieStore.delete(MARKETING_OPT_IN_COOKIE);
  }

  if (isEmailConfigured()) {
    sendWelcomeEmail({
      to: email,
      name: payload.first_name ?? undefined,
    }).catch((err) => console.error("Welcome email failed:", err));
  }

  existing = await getUserWithProfile(userId);

  if (existing && !existing.marketingOptIn && pendingOptIn) {
    await applyPendingMarketingOptIn(existing.id);
    cookieStore.delete(MARKETING_OPT_IN_COOKIE);
    existing = await getUserWithProfile(userId);
  }

  return existing ?? null;
});

export async function getAuthUserId() {
  const { userId } = await safeGetAuth();
  return userId;
}

export type AuthIdentity = {
  userId: string;
  email: string | null;
  name: string;
  emailVerified: boolean;
};

export const getAuthIdentity = cache(async (): Promise<AuthIdentity | null> => {
  const { userId, sessionClaims } = await safeGetAuth();
  if (!userId) return null;

  const emailVerified =
    typeof sessionClaims?.email_verified === "boolean"
      ? sessionClaims.email_verified
      : true;

  const dbUser = await getUserWithProfile(userId);
  if (dbUser && !dbUser.deletedAt) {
    return {
      userId,
      email: dbUser.email,
      name: dbUser.name ?? dbUser.email,
      emailVerified,
    };
  }

  const payload = sessionClaims
    ? payloadFromSessionClaims(userId, sessionClaims)
    : null;
  if (payload) {
    const email = primaryEmailFromClerk(payload);
    return {
      userId,
      email,
      name: displayNameFromClerk(payload) || email || "",
      emailVerified,
    };
  }

  return { userId, email: null, name: "", emailVerified: false };
});

export async function requireSignedIn() {
  const userId = await getAuthUserId();
  if (!userId) redirect("/sign-in");
  return userId;
}

export const requireUser = cache(async () => {
  await requireSignedIn();

  const user = await getOrCreateUser();
  if (!user) redirect("/account/setup");

  return user;
});
