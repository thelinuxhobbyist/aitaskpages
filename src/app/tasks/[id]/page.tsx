import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { RequirementInterestPanel } from "@/app/tasks/requirement-interest-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatRequirementLocation,
  getRequirementCompanyLabel,
  toPublicSummary,
} from "@/lib/requirement-utils";
import { getRequirementById } from "@/lib/requirements";
import { createPageMetadata } from "@/lib/seo";
import { formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { ArrowLeft, Building2, MapPin, Wallet } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const req = await getRequirementById(Number(id));
  if (!req || req.status !== "open") {
    return { title: "Requirement not found" };
  }
  return createPageMetadata({
    title: req.title,
    description: req.description.slice(0, 160),
    path: `/tasks/${req.id}`,
  });
}

export default async function PublicRequirementPage({ params }: Props) {
  const { id } = await params;
  if (id === "new") redirect("/tasks/new");
  const requirementId = Number(id);
  if (!Number.isInteger(requirementId)) notFound();

  const requirement = await getRequirementById(requirementId);
  if (!requirement || requirement.status !== "open") notFound();

  const summary = toPublicSummary(requirement);
  const locationLabel = formatRequirementLocation(
    requirement.location,
    requirement.remoteOk
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-12">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-8">
        <Link href="/tasks">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All tasks
        </Link>
      </Button>

      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-secondary md:text-3xl">
          {requirement.title}
        </h1>
        <p className="text-sm text-muted">
          Posted {formatDateTime(requirement.createdAt)}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            {getRequirementCompanyLabel(
              requirement.companyName,
              requirement.businessType
            )}
          </span>
          {requirement.budget && (
            <span className="flex items-center gap-1.5">
              <Wallet className="h-4 w-4" />
              Est. {formatBudgetGBP(requirement.budget)}
            </span>
          )}
          {locationLabel && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {locationLabel}
            </span>
          )}
        </div>
      </header>

      <section className="space-y-3 border-b border-border py-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Description
        </h2>
        <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">
          {requirement.description}
        </p>
      </section>

      {summary.skillNames.length > 0 && (
        <section className="space-y-3 border-b border-border py-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Skills required
          </h2>
          <div className="flex flex-wrap gap-2">
            {summary.skillNames.map((name) => (
              <Badge key={name} variant="secondary">
                {name}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {summary.serviceNames.length > 0 && (
        <section className="space-y-3 border-b border-border py-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Services needed
          </h2>
          <div className="flex flex-wrap gap-2">
            {summary.serviceNames.map((name) => (
              <Badge key={name} variant="default">
                {name}
              </Badge>
            ))}
          </div>
        </section>
      )}

      <section className="pt-8">
        <RequirementInterestPanel requirementId={requirementId} />
      </section>
    </div>
  );
}
