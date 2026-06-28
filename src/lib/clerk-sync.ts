import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { processUserDeletion } from "@/lib/user-deletion";

/**
 * Clerk → D1 user sync.
 *
 * Primary path: `POST /api/webhooks/clerk` (user.created / user.updated / user.deleted).
 * Fallback: `getOrCreateUser()` in auth.ts when the webhook has not run yet.
 */

export type ClerkUserPayload = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: { id: string; email_address: string }[];
};

const nowIso = () => new Date().toISOString();

export function primaryEmailFromClerk(data: ClerkUserPayload): string | null {
  const addresses = data.email_addresses ?? [];
  const primary = addresses.find((e) => e.id === data.primary_email_address_id);
  return (
    primary?.email_address ??
    addresses[0]?.email_address ??
    null
  );
}

export function displayNameFromClerk(data: ClerkUserPayload): string | null {
  const full = [data.first_name, data.last_name].filter(Boolean).join(" ");
  return full || data.username || primaryEmailFromClerk(data) || null;
}

/** Create or update a D1 user from a Clerk user object. */
export async function upsertUserFromClerk(
  data: ClerkUserPayload,
  opts?: { marketingOptIn?: boolean }
) {
  const email = primaryEmailFromClerk(data);
  if (!email) return null;

  const db = await getDb();
  const ts = nowIso();
  const name = displayNameFromClerk(data);

  const existing = await db.query.users.findFirst({
    where: eq(users.clerkUserId, data.id),
  });

  if (existing) {
    await db
      .update(users)
      .set({
        email,
        name: name ?? existing.name,
        deletedAt: null,
        updatedAt: ts,
        ...(opts?.marketingOptIn === true
          ? { marketingOptIn: true, unsubscribed: false }
          : {}),
      })
      .where(eq(users.id, existing.id));
    return existing.id;
  }

  const [row] = await db
    .insert(users)
    .values({
      clerkUserId: data.id,
      email,
      name,
      role: "freelancer",
      marketingOptIn: opts?.marketingOptIn ?? false,
      unsubscribed: false,
      createdAt: ts,
      updatedAt: ts,
    })
    .returning({ id: users.id });

  return row.id;
}

/** @deprecated Use processUserDeletion — kept for webhook import compatibility. */
export async function softDeleteUserByClerkId(clerkUserId: string) {
  await processUserDeletion(clerkUserId);
}

/** Sync email/name from Clerk on each authenticated visit. */
export async function syncUserFromClerkSession(
  clerkUserId: string,
  email: string,
  name: string | null
) {
  const db = await getDb();
  const existing = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });
  if (!existing || existing.deletedAt) return;

  const patch: Partial<typeof users.$inferInsert> = { updatedAt: nowIso() };
  if (existing.email !== email) patch.email = email;
  if (name && existing.name !== name) patch.name = name;

  if (Object.keys(patch).length > 1) {
    await db.update(users).set(patch).where(eq(users.id, existing.id));
  }
}

export async function applyPendingMarketingOptIn(userId: number) {
  const db = await getDb();
  const ts = nowIso();
  await db
    .update(users)
    .set({ marketingOptIn: true, unsubscribed: false, updatedAt: ts })
    .where(eq(users.id, userId));
}

export async function setMarketingPreference(
  userId: number,
  optedIn: boolean
) {
  const db = await getDb();
  const ts = nowIso();
  await db
    .update(users)
    .set({
      marketingOptIn: optedIn,
      ...(optedIn ? { unsubscribed: false } : {}),
      updatedAt: ts,
    })
    .where(eq(users.id, userId));
}

export async function unsubscribeUser(userId: number) {
  const db = await getDb();
  const ts = nowIso();
  await db
    .update(users)
    .set({
      unsubscribed: true,
      marketingOptIn: false,
      updatedAt: ts,
    })
    .where(eq(users.id, userId));
}
