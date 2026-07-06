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
import { decodeFinderTaskDraft } from "@/lib/finder-task-draft";
import { getAllServices, getAllSkills } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Post Requirement | Dashboard | AI Jobs Market",
};

type Props = {
  searchParams: Promise<{ from?: string; draft?: string }>;
};

export default async function NewRequirementPage({ searchParams }: Props) {
  await requireUser();
  const identity = await getAuthIdentity();
  const { draft: draftParam, from } = await searchParams;
  const finderDraft =
    from === "finder" && draftParam ? decodeFinderTaskDraft(draftParam) : null;

  const [skills, services] = await Promise.all([
    getAllSkills(),
    getAllServices(),
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a requirement</CardTitle>
        <CardDescription>
          {finderDraft
            ? "Your project brief was pre-filled from AI Software Finder. Review the details below, then publish when ready."
            : "Describe the AI expertise you need. Matching experts will be notified when you publish."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {identity && !identity.emailVerified ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Verify your email before posting requirements.
          </p>
        ) : (
          <RequirementForm
            skills={skills}
            services={services}
            finderDraft={finderDraft}
          />
        )}
      </CardContent>
    </Card>
  );
}
