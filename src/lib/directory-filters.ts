import { and, eq, isNull } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { expertProfiles, users } from "@/db/schema";

/** Profiles visible on the public directory and contactable by clients. */
export const PUBLIC_PROFILE_STATUS = "approved" as const;

export function publicExpertProfileConditions(
  extra?: SQL | undefined
): SQL | undefined {
  const base = and(
    eq(expertProfiles.status, PUBLIC_PROFILE_STATUS),
    isNull(users.deletedAt)
  );
  return extra ? and(base, extra) : base;
}
