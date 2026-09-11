import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
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
import { getClerkEnv, syncClerkEnvToProcess } from "@/lib/clerk-env";
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

/**
 * React `cache()` memoizes the first lookup for this request — including a
 * miss. After a webhook/upsert write we must read again uncached, or a brand
 * new account looks like it was never created and the dashboard shows the
 * "Finish setting up your account" banner.
 */
function reloadUserWithProfile(clerkUserId: string) {
  return fetchUserWithProfile(clerkUserId);
}

function claimString(
  claims: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = claims[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function payloadFromSessionClaims(
  userId: string,
  claims: Record<string, unknown>
): ClerkUserPayload | null {
  // Email is not in Clerk's default session token — only present if customized
  // in the Clerk Dashboard (Sessions → Customize session token).
  const email = claimString(
    claims,
    "email",
    "primary_email_address",
    "primaryEmail",
    "primaryEmailAddress"
  );

  if (!email) return null;

  return {
    id: userId,
    first_name: claimString(claims, "first_name", "firstName"),
    last_name: claimString(claims, "last_name", "lastName"),
    username: claimString(claims, "username"),
    primary_email_address_id: null,
    email_addresses: [{ id: "session", email_address: email }],
  };
}

function payloadFromClerkUser(user: {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  primaryEmailAddressId: string | null;
  emailAddresses: { id: string; emailAddress: string }[];
}): ClerkUserPayload {
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
    const { secretKey, publishableKey } = await getClerkEnv();
    if (!secretKey) {
      console.error(
        "CLERK_SECRET_KEY missing — cannot sync Clerk user to D1:",
        userId
      );
      return null;
    }
    if (secretKey.startsWith("sk_test_") && publishableKey.startsWith("pk_live_")) {
      console.error(
        "CLERK_SECRET_KEY is a test key but publishable key is live — user sync will fail"
      );
    }

    // Race session + Backend API — cold Workers often need >5s for Clerk.
    const client = await clerkClient();
    const [fromSession, fromApi] = await Promise.all([
      withTimeout(currentUser(), 12000, null),
      withTimeout(client.users.getUser(userId), 12000, null),
    ]);

    if (fromSession?.id === userId && fromSession.emailAddresses.length > 0) {
      return payloadFromClerkUser(fromSession);
    }
    if (fromApi) return payloadFromClerkUser(fromApi);
    return null;
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
    // Webhook may have inserted while we waited on Clerk.
    existing = await reloadUserWithProfile(userId);
    return existing && !existing.deletedAt ? existing : null;
  }

  const cookieStore = await cookies();
  const pendingOptIn =
    cookieStore.get(MARKETING_OPT_IN_COOKIE)?.value === "1";

  try {
    await upsertUserFromClerk(payload, { marketingOptIn: pendingOptIn });
  } catch (err) {
    console.error("D1 upsert from Clerk failed:", userId, err);
    // Webhook may have won the race — re-read before giving up.
    existing = await reloadUserWithProfile(userId);
    return existing && !existing.deletedAt ? existing : null;
  }

  if (pendingOptIn) {
    cookieStore.delete(MARKETING_OPT_IN_COOKIE);
  }

  if (isEmailConfigured()) {
    sendWelcomeEmail({
      to: email,
      name: payload.first_name ?? undefined,
    }).catch((err) => console.error("Welcome email failed:", err));
  }

  existing = await reloadUserWithProfile(userId);

  if (existing && !existing.marketingOptIn && pendingOptIn) {
    await applyPendingMarketingOptIn(existing.id);
    cookieStore.delete(MARKETING_OPT_IN_COOKIE);
    existing = await reloadUserWithProfile(userId);
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
