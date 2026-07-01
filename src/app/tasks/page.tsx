import Link from "next/link";
import type { Metadata } from "next";
import { RequirementCard } from "@/app/tasks/requirement-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOpenRequirements } from "@/lib/requirements";
import { createPageMetadata } from "@/lib/seo";
import { Briefcase, Plus } from "lucide-react";

export const metadata: Metadata = createPageMetadata({
  title: "AI tasks",
  description:
    "Browse open AI tasks from UK businesses on AI Jobs Market.",
  path: "/tasks",
});

export const dynamic = "force-dynamic";

export default async function RequirementsDirectoryPage() {
  const requirements = await getOpenRequirements();

  return (
    <>
      <section className="border-b border-border bg-surface-container">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            AI Tasks
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
            Browse open AI tasks
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            UK businesses posting AI project needs. Experts can express interest;
            businesses choose who to contact.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/requirements/new">
                <Plus className="mr-2 h-4 w-4" />
                Post a task
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/opportunities">My opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {requirements.length === 0 ? (
          <Card>
            <CardContent className="px-6 py-16 text-center">
              <Briefcase
                className="mx-auto h-10 w-10 text-muted"
                strokeWidth={1.5}
              />
              <p className="mt-4 text-lg font-semibold text-secondary">
                No open tasks yet
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Be the first to post an AI task, or check back as businesses
                add new opportunities.
              </p>
              <Button asChild className="mt-6">
                <Link href="/dashboard/requirements/new">Post a task</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted">
              {requirements.length} open task
              {requirements.length !== 1 ? "s" : ""} · newest first
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {requirements.map((req) => (
                <RequirementCard key={req.id} requirement={req} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
