import { getEnvSecret } from "@/lib/env-secrets";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

/** Validates `Authorization: Bearer <ADMIN_API_KEY>`. */
export function verifyAdminApiKey(request: Request): boolean {
  const expected = getEnvSecret("ADMIN_API_KEY");
  if (!expected) return false;
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice("Bearer ".length) === expected;
}

export function unauthorizedAdminResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

/** Requires a signed-in user with the admin role. */
export async function requireAdminUser() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}
