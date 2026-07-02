import { redirect } from "next/navigation";
import { AccountSyncBanner } from "@/components/account-sync-banner";
import { getAuthUserId, getOrCreateUser } from "@/lib/auth";

export default async function AccountSetupPage() {
  const userId = await getAuthUserId();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <AccountSyncBanner />
    </div>
  );
}
