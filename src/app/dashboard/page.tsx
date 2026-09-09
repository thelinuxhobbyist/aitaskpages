import Link from "next/link";
import type { Metadata } from "next";
import { ProfileForm } from "@/app/dashboard/profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DocumentLink } from "@/components/document-link";
import { requireUser } from "@/lib/auth";
import {
  getClientConversations,
  getExpertConversations,
} from "@/lib/conversations";
import { getClientRequirements } from "@/lib/requirements";
import { computeCompleteness, getProfileCompletenessSuggestions, type ProfileWithRelations } from "@/lib/profile-utils";
import { getAllServices, getAllSkills } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const [skills, services] = await Promise.all([
    getAllSkills(),
    getAllServices(),
  ]);

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
  const isNewUser = !profile && clientRequirements.length === 0;

  return (
    <>
      {isNewUser && (
        <Card className="mb-8 border-primary/25 bg-primary-container/40">
          <CardHeader>
            <CardTitle>Welcome — how would you like to get started?</CardTitle>
            <CardDescription>
              AI Jobs Market connects UK businesses with AI professionals and
              companies. Pick the path that fits you.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DocumentLink
              href="/tasks/new"
              className="group rounded-xl border border-border bg-surface p-5 transition-shadow hover:border-primary/30 hover:shadow-md"
            >
              <p className="font-semibold text-secondary group-hover:text-primary">
                I need AI help
              </p>
              <p className="mt-1 text-sm text-muted">
                Post a task and get matched with relevant AI professionals and
                companies.
              </p>
            </DocumentLink>
            <a
              href="#profile-form"
              className="group rounded-xl border border-border bg-surface p-5 transition-shadow hover:border-primary/30 hover:shadow-md"
            >
              <p className="font-semibold text-secondary group-hover:text-primary">
                I offer AI expertise
              </p>
              <p className="mt-1 text-sm text-muted">
                Create an individual or company profile so businesses can find
                and contact you.
              </p>
            </a>
          </CardContent>
        </Card>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <CardDescription>Messages on AI Jobs Market</CardDescription>
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
              <p className="text-sm text-muted">Create your profile below</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card id="profile-form">
        <CardHeader>
          <CardTitle>{profile ? "Edit profile" : "Create your profile"}</CardTitle>
          <CardDescription>
            Add your details so businesses can find and contact you. Individual
            and company profiles appear together in Find AI Expertise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} skills={skills} services={services} />
        </CardContent>
      </Card>
    </>
  );
}
