import type { Metadata } from "next";
import { RequirementForm } from "@/app/dashboard/requirements/requirement-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthIdentity, requireUser } from "@/lib/auth";
import { getAllServices, getAllSkills } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Post Requirement | Dashboard | AI Jobs Market",
};

export default async function NewRequirementPage() {
  await requireUser();
  const identity = await getAuthIdentity();
  const [skills, services] = await Promise.all([
    getAllSkills(),
    getAllServices(),
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a requirement</CardTitle>
        <CardDescription>
          Describe the AI expertise you need. Matching experts will be notified
          when you publish.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {identity && !identity.emailVerified ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Verify your email before posting requirements.
          </p>
        ) : (
          <RequirementForm skills={skills} services={services} />
        )}
      </CardContent>
    </Card>
  );
}
