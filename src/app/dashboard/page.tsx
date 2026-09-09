import Link from "next/link";
import type { Metadata } from "next";
import { Building2, User } from "lucide-react";
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
import {
  computeCompleteness,
  getProfileCompletenessSuggestions,
  type ProfileWithRelations,
} from "@/lib/profile-utils";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { isProfileType, type ProfileType } from "@/lib/profile-type";

export const metadata: Metadata = {
  title: "Dashboard",
};

type SearchParams = Promise<{ intent?: string; type?: string }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requireUser();
  const params = await searchParams;
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
  const wantsToOffer = params.intent === "offer";
  const selectedType: ProfileType | null = isProfileType(params.type)
    ? params.type
    : null;
  const showWelcomeChoice = isNewUser && !wantsToOffer;
  const showTypeChoice = isNewUser && wantsToOffer && !selectedType;
  const showStats = !isNewUser || wantsToOffer;
  // Form after a type is chosen, or for anyone who already has activity/profile.
  const showProfileForm = !isNewUser || Boolean(selectedType);

  return (
    <>
      {showWelcomeChoice && (
        <Card className="mb-8 border-accent/30 bg-card">
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
              className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:border-primary/30 hover:shadow-md"
            >
              <p className="font-semibold text-secondary group-hover:text-primary">
                I need AI help
              </p>
              <p className="mt-1 text-sm text-muted">
                Post a task and get matched with relevant AI professionals and
                companies.
              </p>
            </DocumentLink>
            <Link
              href="/dashboard?intent=offer"
              className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:border-primary/30 hover:shadow-md"
            >
              <p className="font-semibold text-secondary group-hover:text-primary">
                I offer AI expertise
              </p>
              <p className="mt-1 text-sm text-muted">
                Create an individual or company profile so businesses can find
                and contact you.
              </p>
            </Link>
          </CardContent>
        </Card>
      )}

      {showTypeChoice && (
        <Card className="mb-8 border-accent/30 bg-card">
          <CardHeader>
            <CardTitle>What type of profile do you want?</CardTitle>
            <CardDescription>
              Choose how you appear in Find AI Expertise. You can switch between
              Individual and Company later from your dashboard.
            </CardDescription>
            <p className="pt-1">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted hover:text-primary hover:underline"
              >
                ← Back to get started
              </Link>
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/dashboard?intent=offer&type=individual"
              className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:border-primary/30 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </span>
              <p className="mt-3 font-semibold text-secondary group-hover:text-primary">
                Individual Expert
              </p>
              <p className="mt-1 text-sm text-muted">
                Showcase your personal AI expertise and experience.
              </p>
            </Link>
            <Link
              href="/dashboard?intent=offer&type=company"
              className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:border-primary/30 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </span>
              <p className="mt-3 font-semibold text-secondary group-hover:text-primary">
                Company
              </p>
              <p className="mt-1 text-sm text-muted">
                Showcase your company&apos;s AI capabilities and team.
              </p>
            </Link>
          </CardContent>
        </Card>
      )}

      {showStats && (
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
                <p className="text-sm text-muted">
                  {showTypeChoice
                    ? "Choose a profile type above to get started"
                    : "Complete the form below to publish"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {showProfileForm && (
        <Card id="profile-form">
          <CardHeader>
            <CardTitle>
              {profile ? "Edit profile" : "Create your profile"}
            </CardTitle>
            <CardDescription>
              Add your details so businesses can find and contact you. Individual
              and company profiles appear together in Find AI Expertise.
            </CardDescription>
            {isNewUser && selectedType && (
              <p className="pt-1">
                <Link
                  href="/dashboard?intent=offer"
                  className="text-sm font-medium text-muted hover:text-primary hover:underline"
                >
                  ← Change profile type
                </Link>
              </p>
            )}
          </CardHeader>
          <CardContent>
            <ProfileForm
              profile={profile}
              skills={skills}
              services={services}
              initialProfileType={selectedType}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
}
