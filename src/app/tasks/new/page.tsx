import Link from "next/link";
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
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Post a Task",
  description:
    "Post an AI task or project requirement on AI Task Pages. Connect directly with independent UK AI experts.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ from?: string; draft?: string }>;
};

export default async function PostTaskPage({ searchParams }: Props) {
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
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-12">
      <div className="mb-8">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-on-surface"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tasks
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          Post a Task
        </h1>
        <p className="mt-2 text-muted">
          Describe the AI expertise you need. Matching experts will be notified when you publish.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task details</CardTitle>
          <CardDescription>
            {finderDraft
              ? "Your project brief was pre-filled from AI Software Finder. Review the details below, then publish when ready."
              : "Fill in the details of the work you need done. You can save as a draft or publish immediately."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {identity && !identity.emailVerified ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Verify your email before posting tasks.
            </p>
          ) : (
            <RequirementForm
              skills={skills}
              services={services}
              finderDraft={finderDraft}
              cancelHref="/tasks"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
