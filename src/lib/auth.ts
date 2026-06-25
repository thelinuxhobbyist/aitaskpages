import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { sendWelcomeEmail, isEmailConfigured } from "@/lib/email";

async function getUserWithProfile(clerkUserId: string) {
  const db = getDb();
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

/** Returns the D1 user row, creating it on first Clerk sign-in. */
export async function getOrCreateUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await getUserWithProfile(userId);
  if (existing) return existing;

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const db = getDb();
  await db.insert(users).values({
    clerkUserId: userId,
    email,
    role: "freelancer",
  });

  if (isEmailConfigured()) {
    sendWelcomeEmail({
      to: email,
      name: clerkUser?.firstName ?? undefined,
    }).catch((err) => console.error("Welcome email failed:", err));
  }

  return getUserWithProfile(userId);
}

/** Requires an authenticated user; redirects to sign-in if missing. */
export async function requireUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  return user;
}
