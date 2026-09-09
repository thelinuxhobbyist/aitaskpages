import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Building2, User } from "lucide-react";
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
import { getClientRequirements } from "@/lib/requirements";
import type { ProfileWithRelations } from "@/lib/profile-utils";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { isProfileType, type ProfileType } from "@/lib/profile-type";

export const metadata: Metadata = {
  title: "Profile",
};

type SearchParams = Promise<{ intent?: string; type?: string }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const [skills, services, clientRequirements] = await Promise.all([
    getAllSkills(),
    getAllServices(),
    getClientRequirements(user.id),
  ]);

  const profile = (user.profile as ProfileWithRelations | null) ?? null;
  const isNewUser = !profile && clientRequirements.length === 0;
  const wantsToOffer = params.intent === "offer";
  const selectedType: ProfileType | null = isProfileType(params.type)
    ? params.type
    : null;
  const showWelcomeChoice = isNewUser && !wantsToOffer;
  const showTypeChoice = isNewUser && wantsToOffer && !selectedType;
  const showProfileForm = !isNewUser || Boolean(selectedType);

  return (
    <>
      {showWelcomeChoice && (
        <Card className="border-accent/30 bg-card">
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
        <div>
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-on-surface"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to get started
          </Link>
          <Card className="border-accent/30 bg-card">
            <CardHeader>
              <CardTitle>What type of profile do you want?</CardTitle>
              <CardDescription>
                Choose how you appear in Find AI Expertise. You can switch
                between Individual and Company later from your dashboard.
              </CardDescription>
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
        </div>
      )}

      {showProfileForm && (
        <div>
          {isNewUser && selectedType && (
            <Link
              href="/dashboard?intent=offer"
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-on-surface"
            >
              <ArrowLeft className="h-4 w-4" />
              Change profile type
            </Link>
          )}
          <Card id="profile-form">
            <CardHeader>
              <CardTitle>
                {profile ? "Edit profile" : "Create your profile"}
              </CardTitle>
              <CardDescription>
                Add your details so businesses can find and contact you.
                Individual and company profiles appear together in Find AI
                Expertise.
              </CardDescription>
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
        </div>
      )}
    </>
  );
}
