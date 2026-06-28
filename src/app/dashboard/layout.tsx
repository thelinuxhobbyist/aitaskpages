import type { Metadata } from "next";
import { DashboardNav } from "@/app/dashboard/dashboard-nav";
import { getAuthIdentity, requireUser } from "@/lib/auth";
import { countClientUnread, countExpertUnread } from "@/lib/conversations";
import { countOpenRequirementsForExpert } from "@/lib/requirements";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const identity = await getAuthIdentity();

  const [clientUnread, expertUnread, newOpportunityCount] = await Promise.all([
    countClientUnread(user.id),
    user.profile ? countExpertUnread(user.profile.id) : Promise.resolve(0),
    user.profile
      ? countOpenRequirementsForExpert(user.profile.id)
      : Promise.resolve(0),
  ]);
  const unreadCount = clientUnread + expertUnread;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-secondary">Dashboard</h1>
        <p className="mt-1 text-muted">
          Manage your profile, requirements, and conversations.
        </p>
      </div>
      <DashboardNav
        unreadCount={unreadCount}
        newOpportunityCount={newOpportunityCount}
      />

      {identity && !identity.emailVerified && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong className="font-semibold">Verify your email.</strong> Your
          profile stays hidden and can&apos;t receive enquiries until your email
          is verified. Open the account menu (top-right) to verify your address.
        </div>
      )}

      <div className="mt-8">{children}</div>
    </div>
  );
}
