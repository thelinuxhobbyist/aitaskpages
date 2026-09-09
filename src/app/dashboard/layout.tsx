import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { DashboardNav } from "@/app/dashboard/dashboard-nav";
import { AccountSyncBanner } from "@/components/account-sync-banner";
import { DelayedFallback } from "@/components/delayed-fallback";
import { PageHero } from "@/components/page-hero";
import { RouteLoadingIndicator } from "@/components/route-loading-indicator";
import { Button } from "@/components/ui/button";
import { getOrCreateUser, requireSignedIn } from "@/lib/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <DelayedFallback>
          <div className="mx-auto max-w-4xl px-5 py-10">
            <RouteLoadingIndicator label="Loading dashboard" />
          </div>
        </DelayedFallback>
      }
    >
      <DashboardLayoutBody>{children}</DashboardLayoutBody>
    </Suspense>
  );
}

async function DashboardLayoutBody({ children }: { children: ReactNode }) {
  await requireSignedIn();
  const user = await getOrCreateUser();

  return (
    <>
      <PageHero>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1>Dashboard</h1>
            <p className="mt-2 max-w-xl text-muted">
              Manage your profile, requirements, and conversations.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to site</Link>
          </Button>
        </div>
      </PageHero>

      <div className="mx-auto max-w-4xl px-5 py-8 md:py-10">
        {user ? (
          <>
            <DashboardNav unreadCount={0} newOpportunityCount={0} />
            <div className="mt-8">{children}</div>
          </>
        ) : (
          <AccountSyncBanner />
        )}
      </div>
    </>
  );
}
