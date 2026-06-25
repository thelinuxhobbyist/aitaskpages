import Link from "next/link";
import { ProfileForm } from "@/app/dashboard/profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { computeCompleteness, type ProfileWithRelations } from "@/lib/profile-utils";
import { getAllServices, getAllSkills } from "@/lib/profiles";

export default async function DashboardPage() {
  const user = await requireUser();
  const [skills, services] = await Promise.all([
    getAllSkills(),
    getAllServices(),
  ]);

  const profile = (user.profile as ProfileWithRelations | null) ?? null;
  const completeness = profile ? computeCompleteness(profile) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary">Dashboard</h1>
        <p className="mt-1 text-muted">
          Manage your expert profile and track basic stats.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Completeness</CardTitle>
            <CardDescription>How complete your profile is</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{completeness}%</p>
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
                href={`/freelancers/${profile.slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                /freelancers/{profile.slug}
              </Link>
            ) : (
              <p className="text-sm text-muted">Create your profile below</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{profile ? "Edit profile" : "Create your profile"}</CardTitle>
          <CardDescription>
            Add your details so businesses can find and contact you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} skills={skills} services={services} />
        </CardContent>
      </Card>
    </div>
  );
}
