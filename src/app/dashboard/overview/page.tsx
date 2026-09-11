import Link from "next/link";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import {
  getClientConversations,
  getExpertConversations,
} from "@/lib/conversations";
import { getClientRequirements } from "@/lib/requirements";
import {
  computeCompleteness,
  getProfileCompletenessSuggestions,
  type ProfileWithRelations,
} from "@/lib/profile-utils";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function DashboardOverviewPage() {
  const user = await requireUser();
  const profile = (user.profile as ProfileWithRelations | null) ?? null;
  const completeness = profile ? computeCompleteness(profile) : 0;
  const suggestions = profile ? getProfileCompletenessSuggestions(profile) : [];

  const [clientConvos, expertConvos, clientRequirements] = await Promise.all([
    getClientConversations(user.id),
    profile ? getExpertConversations(profile.id) : Promise.resolve([]),
    getClientRequirements(user.id),
  ]);
  const conversations = {
    total: clientConvos.length + expertConvos.length,
    unread:
      clientConvos.filter((c) => c.unread).length +
      expertConvos.filter((c) => c.unread).length,
  };
  const openRequirements = clientRequirements.filter(
    (r) => r.status === "open"
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Link href="/dashboard/requirements" className="group">
        <Card className="h-full transition-shadow group-hover:shadow-md group-hover:border-primary/30">
          <CardHeader>
            <CardTitle className="text-base">Requirements</CardTitle>
            <CardDescription>AI needs you&apos;ve posted</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {clientRequirements.length}
              {openRequirements > 0 && (
                <span className="ml-2 align-middle text-sm font-semibold text-emerald-700">
                  {openRequirements} open
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile views</CardTitle>
          <CardDescription>Total page visits</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">
            {profile?.profileViews ?? 0}
          </p>
        </CardContent>
      </Card>

      <Link href="/dashboard/conversations" className="group">
        <Card className="h-full transition-shadow group-hover:shadow-md group-hover:border-primary/30">
          <CardHeader>
            <CardTitle className="text-base">Conversations</CardTitle>
            <CardDescription>Messages on AI Task Pages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {conversations.total}
              {conversations.unread > 0 && (
                <span className="ml-2 align-middle text-sm font-semibold text-amber-700">
                  {conversations.unread} new
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile completeness</CardTitle>
          <CardDescription>
            {profile
              ? completeness === 100
                ? "Your profile is fully complete"
                : "Complete these to improve your listing"
              : "Create your profile to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{completeness}%</p>
          {!profile && (
            <Link
              href="/dashboard?intent=offer"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Set up your profile
            </Link>
          )}
          {profile && completeness < 100 && (
            <>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-muted">
                {suggestions.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                Edit profile
              </Link>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Public profile</CardTitle>
          <CardDescription>Your directory listing</CardDescription>
        </CardHeader>
        <CardContent>
          {profile ? (
            <Link
              href={`/experts/${profile.slug}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              /experts/{profile.slug}
            </Link>
          ) : (
            <Link
              href="/dashboard?intent=offer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Create a profile to publish
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
