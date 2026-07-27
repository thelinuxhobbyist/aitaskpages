import type { Metadata } from "next";
import Link from "next/link";
import { DashboardNav } from "@/app/dashboard/dashboard-nav";
import { AccountSyncBanner } from "@/components/account-sync-banner";
import { Button } from "@/components/ui/button";
import { getOrCreateUser, requireSignedIn } from "@/lib/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSignedIn();
  const user = await getOrCreateUser();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1>Dashboard</h1>
          <p className="mt-2 text-muted">
            Manage your profile, requirements, and conversations.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Back to site</Link>
        </Button>
      </div>

      {user ? (
        <>
          <DashboardNav unreadCount={0} newOpportunityCount={0} />
          <div className="mt-8">{children}</div>
        </>
      ) : (
        <AccountSyncBanner />
      )}
    </div>
  );
}
