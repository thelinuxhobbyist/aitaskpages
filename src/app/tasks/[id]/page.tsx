import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  TaskInterestSidebar,
  type TaskInterestViewer,
} from "@/app/tasks/task-interest-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { SuccessBanner } from "@/components/ui/success-banner";
import { getAuthIdentity, getOrCreateUser } from "@/lib/auth";
import { PUBLIC_PROFILE_STATUS } from "@/lib/directory-filters";
import {
  formatRequirementLocation,
  getBusinessTypeLabel,
  getRequirementCompanyLabel,
  toPublicSummary,
} from "@/lib/requirement-utils";
import {
  getRequirementById,
  hasExpertInterest,
} from "@/lib/requirements";
import { createPageMetadata } from "@/lib/seo";
import { structureTaskDescription } from "@/lib/task-description";
import { formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ live?: string; posted?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const req = await getRequirementById(Number(id));
  if (!req || req.status !== "open") {
    return { title: "Task not found" };
  }
  return createPageMetadata({
    title: req.title,
    description: req.description.slice(0, 160),
    path: `/tasks/${req.id}`,
  });
}

function SectionHeading({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-xl font-semibold tracking-tight text-secondary md:text-2xl">
        {title}
      </h2>
      {intro ? <p className="mt-2 text-muted">{intro}</p> : null}
    </div>
  );
}

function DescriptionBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-border pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
        {title}
      </h3>
      <div className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-on-surface">
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="shrink-0 text-sm font-medium text-muted">{label}</dt>
      <dd className="text-sm font-semibold text-secondary sm:text-right">
        {value}
      </dd>
    </div>
  );
}

export default async function PublicRequirementPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  if (id === "new") redirect("/tasks/new");
  const requirementId = Number(id);
  if (!Number.isInteger(requirementId)) notFound();

  const requirement = await getRequirementById(requirementId);
  if (!requirement || requirement.status !== "open") notFound();

  const { live, posted } = await searchParams;
  const identity = await getAuthIdentity();
  const viewer = identity ? await getOrCreateUser() : null;
  const isOwner = !!viewer && viewer.id === requirement.clientUserId;
  const showLiveBanner = isOwner && (live === "1" || posted === "1");

  const summary = toPublicSummary(requirement);
  const locationLabel = formatRequirementLocation(
    requirement.location,
    requirement.remoteOk
  );
  const companyLabel = getRequirementCompanyLabel(
    requirement.companyName,
    requirement.businessType
  );
  const budgetLabel = requirement.budget
    ? formatBudgetGBP(requirement.budget)
    : null;
  const businessTypeLabel = getBusinessTypeLabel(requirement.businessType);
  const sections = structureTaskDescription(requirement.description);

  const metaParts = [
    companyLabel,
    requirement.location?.trim() || null,
    requirement.remoteOk ? "Remote OK" : null,
  ].filter(Boolean);

  let interestViewer: TaskInterestViewer = { kind: "signed_out" };

  if (identity) {
    if (!viewer) {
      interestViewer = { kind: "syncing" };
    } else if (isOwner) {
      interestViewer = { kind: "owner" };
    } else if (!viewer.profile) {
      interestViewer = { kind: "needs_profile" };
    } else if (viewer.profile.status !== PUBLIC_PROFILE_STATUS) {
      interestViewer = { kind: "pending_profile" };
    } else if (!identity.emailVerified) {
      interestViewer = { kind: "unverified" };
    } else {
      interestViewer = {
        kind: "ready",
        alreadyInterested: await hasExpertInterest(
          requirementId,
          viewer.profile.id
        ),
      };
    }
  }

  return (
    <>
      <PageHero innerClassName="max-w-6xl px-4 py-8 md:py-10">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All tasks
          </Link>
        </Button>

        <div className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-emerald-100 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-emerald-800 ring-1 ring-emerald-200/80">
              Open task
            </Badge>
            <p className="text-sm text-muted">
              Posted {formatDateTime(requirement.createdAt)}
            </p>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-secondary md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {requirement.title}
          </h1>

          <p className="mt-4 text-base text-muted md:text-lg">
            {metaParts.join(" · ")}
          </p>

          {summary.skillNames.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {summary.skillNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-ink-foreground"
                >
                  {name}
                </span>
              ))}
            </div>
          )}

          {isOwner && (
            <div className="mt-6">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/requirements/${requirementId}`}>
                  Edit task
                </Link>
              </Button>
            </div>
          )}
        </div>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {showLiveBanner && (
          <SuccessBanner title="Your task is now live." className="mb-8">
            Experts can see this task and show interest.
          </SuccessBanner>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-12">
          <div className="space-y-10 md:space-y-12">
            <section>
              <SectionHeading title="Description" />
              <div className="space-y-0 rounded-2xl border border-border bg-card p-5 sm:p-7">
                {sections.overview ? (
                  <DescriptionBlock title="What they're trying to achieve">
                    {sections.overview}
                  </DescriptionBlock>
                ) : (
                  <>
                    {sections.goal && (
                      <DescriptionBlock title="What they're trying to achieve">
                        {sections.goal}
                      </DescriptionBlock>
                    )}
                    {sections.existing && (
                      <DescriptionBlock title="What they already have">
                        {sections.existing}
                      </DescriptionBlock>
                    )}
                    {sections.helpNeeded && (
                      <DescriptionBlock title="Where they need help">
                        {sections.helpNeeded}
                      </DescriptionBlock>
                    )}
                  </>
                )}
              </div>
            </section>

            {(summary.skillNames.length > 0 ||
              summary.serviceNames.length > 0) && (
              <section>
                <SectionHeading title="What they're looking for" />
                <div className="grid gap-8 sm:grid-cols-2">
                  {summary.skillNames.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                        Expertise
                      </h3>
                      <ul className="mt-4 space-y-3">
                        {summary.skillNames.map((name) => (
                          <li
                            key={name}
                            className="border-b border-border pb-3 text-base font-semibold text-secondary last:border-b-0 last:pb-0"
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {summary.serviceNames.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                        Help needed
                      </h3>
                      <ul className="mt-4 space-y-3">
                        {summary.serviceNames.map((name) => (
                          <li
                            key={name}
                            className="border-b border-border pb-3 text-base font-semibold text-secondary last:border-b-0 last:pb-0"
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section>
              <SectionHeading title="Task details" />
              <dl className="rounded-2xl border border-border bg-card px-5 sm:px-6">
                <DetailRow label="Company" value={companyLabel} />
                <DetailRow
                  label="Location"
                  value={requirement.location?.trim() || "Not specified"}
                />
                <DetailRow
                  label="Remote availability"
                  value={requirement.remoteOk ? "Remote OK" : "On-site / hybrid"}
                />
                <DetailRow
                  label="Budget"
                  value={budgetLabel ?? "Not specified"}
                />
                <DetailRow
                  label="Posted"
                  value={formatDateTime(requirement.createdAt)}
                />
                <DetailRow label="Status" value="Open task" />
              </dl>
            </section>

            <section>
              <SectionHeading title="About the business" />
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <p className="font-heading text-xl font-semibold text-secondary">
                  {companyLabel}
                </p>
                <p className="mt-1 text-sm font-medium text-muted">
                  {businessTypeLabel}
                  {locationLabel ? ` · ${locationLabel}` : ""}
                </p>
              </div>
            </section>
          </div>

          <div className="lg:sticky lg:top-24">
            <TaskInterestSidebar
              requirementId={requirementId}
              budgetLabel={budgetLabel}
              viewer={interestViewer}
            />
          </div>
        </div>
      </div>
    </>
  );
}
