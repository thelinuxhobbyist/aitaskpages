import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SuccessBanner } from "@/components/ui/success-banner";
import { DocumentLink } from "@/components/document-link";
import { DeleteRequirementButton } from "@/app/dashboard/requirements/delete-requirement-button";
import { requireUser } from "@/lib/auth";
import { getClientRequirements } from "@/lib/requirements";
import { formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { Building2, MapPin, Pencil, Plus, Users, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "My Tasks",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
  filled: "Filled",
};

type SearchParams = Promise<{ saved?: string; deleted?: string }>;

export default async function RequirementsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requireUser();
  const requirements = await getClientRequirements(user.id);
  const { saved, deleted } = await searchParams;

  return (
    <div className="space-y-6">
      {saved === "1" && (
        <SuccessBanner title="Draft saved.">
          Your task is saved as a draft. Publish it when you&apos;re ready.
        </SuccessBanner>
      )}
      {deleted === "1" && (
        <SuccessBanner title="Task deleted.">
          The task has been permanently removed.
        </SuccessBanner>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-secondary">
            My tasks
          </h2>
          <p className="text-sm text-muted">
            Post AI tasks, edit them while they&apos;re live, and review experts
            who express interest.
          </p>
        </div>
        <Button asChild>
          <DocumentLink href="/tasks/new">
            <Plus className="mr-2 h-4 w-4" />
            Post a task
          </DocumentLink>
        </Button>
      </div>

      {requirements.length === 0 ? (
        <Card>
          <CardContent className="px-6 py-10 text-center">
            <p className="text-sm text-muted">
              You haven&apos;t posted any tasks yet. Share what you need and
              matching experts will be notified.
            </p>
            <Button asChild className="mt-4">
              <DocumentLink href="/tasks/new">Post your first task</DocumentLink>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requirements.map((req) => (
            <Card key={req.id} className="transition-shadow hover:shadow-md">
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/dashboard/requirements/${req.id}`}
                        className="font-semibold text-secondary hover:text-primary hover:underline"
                      >
                        {req.title}
                      </Link>
                      <Badge
                        variant={
                          req.status === "open" ? "featured" : "secondary"
                        }
                      >
                        {STATUS_LABELS[req.status] ?? req.status}
                      </Badge>
                    </div>
                    <time className="mt-1 block text-xs text-muted">
                      Posted {formatDateTime(req.createdAt)}
                    </time>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {req.companyName}
                  </span>
                  {req.budget && (
                    <span className="flex items-center gap-1.5">
                      <Wallet className="h-4 w-4" />
                      Est. {formatBudgetGBP(req.budget)}
                    </span>
                  )}
                  {req.locationLabel && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {req.locationLabel}
                    </span>
                  )}
                  {req.status === "open" && (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {req.interestCount} interested
                    </span>
                  )}
                </div>

                {(req.skillNames.length > 0 || req.serviceNames.length > 0) && (
                  <div className="flex flex-wrap gap-1.5">
                    {[...req.skillNames, ...req.serviceNames].map((name) => (
                      <Badge key={name} variant="secondary">
                        {name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/requirements/${req.id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      {req.status === "draft" || req.status === "open"
                        ? "Edit"
                        : "View"}
                    </Link>
                  </Button>
                  {req.status === "open" && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/tasks/${req.id}`}>Public page</Link>
                    </Button>
                  )}
                  <DeleteRequirementButton
                    requirementId={req.id}
                    title={req.title}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
