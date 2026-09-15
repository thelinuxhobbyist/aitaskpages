import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  TaskInterestSidebar,
  type TaskInterestViewer,
} from "@/app/tasks/task-interest-sidebar";
import { Button } from "@/components/ui/button";
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
import { createPageMetadata, taskPageDescription } from "@/lib/seo";
import {
  structureTaskDescription,
  taskOpeningSummary,
} from "@/lib/task-description";
import { cn, formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { ArrowLeft, MapPin, Wallet } from "lucide-react";

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
    description: taskPageDescription(req.title, req.description),
    path: `/tasks/${req.id}`,
  });
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-heading text-xl font-semibold tracking-tight text-secondary md:text-[1.35rem]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="whitespace-pre-wrap text-[1.05rem] leading-[1.75] text-on-surface/90">
      {children}
    </div>
  );
}

function Fact({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-border/80 bg-card/80 px-4 py-3 shadow-soft">
      <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-secondary">{value}</dd>
    </div>
  );
}

function ExpertisePills({ names }: { names: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {names.map((name) => (
        <li
          key={name}
          className="rounded-full border border-border bg-surface-container-high px-3 py-1.5 text-sm font-medium text-on-surface"
        >
          {name}
        </li>
      ))}
    </ul>
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
  const opening = taskOpeningSummary(requirement.description);
  const showGoalSection = Boolean(
    sections.goal && sections.goal.trim() !== opening.trim()
  );
  const expertiseTags = [
    ...summary.skillNames,
    ...summary.serviceNames.filter(
      (name) => !summary.skillNames.includes(name)
    ),
  ];
  const postedLabel = formatDateTime(requirement.createdAt);

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
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-gradient-hero"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All requests
          </Link>
        </Button>

        {showLiveBanner && (
          <SuccessBanner title="Your request is now live." className="mt-6">
            People with relevant expertise can see this and connect with you
            directly.
          </SuccessBanner>
        )}

        <div
          className={cn(
            "mt-8 grid items-start gap-10",
            "lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:gap-12 xl:gap-16"
          )}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted">
              Looking for relevant expertise · Posted {postedLabel}
            </p>

            <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-secondary md:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
              {requirement.title}
            </h1>

            {opening ? (
              <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl md:leading-relaxed">
                {opening}
              </p>
            ) : null}

            {expertiseTags.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Looking for expertise in
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {expertiseTags.map((name) => (
                    <li
                      key={name}
                      className="inline-flex items-center rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-ink-foreground"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-start justify-between gap-4 border-t border-border/70 pt-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Posted by
                </p>
                <p className="mt-1 font-heading text-lg font-semibold text-secondary">
                  {companyLabel}
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  {businessTypeLabel}
                  {locationLabel ? ` · ${locationLabel}` : ""}
                </p>
              </div>
              {isOwner && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/requirements/${requirementId}`}>
                    Edit request
                  </Link>
                </Button>
              )}
            </div>

            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              <Fact
                label="Guide budget"
                value={budgetLabel ?? "To discuss"}
                icon={<Wallet className="h-3.5 w-3.5" aria-hidden />}
              />
              <Fact
                label="Location"
                value={
                  requirement.location?.trim() ||
                  (requirement.remoteOk ? "Remote" : "Not specified")
                }
                icon={<MapPin className="h-3.5 w-3.5" aria-hidden />}
              />
              <Fact
                label="Working together"
                value={
                  requirement.remoteOk
                    ? "Remote welcome"
                    : "On-site / in person"
                }
              />
            </dl>

            <div className="mt-8 lg:hidden">
              <TaskInterestSidebar
                requirementId={requirementId}
                posterLabel={companyLabel}
                budgetLabel={budgetLabel}
                viewer={interestViewer}
              />
            </div>

            <div className="mt-12 space-y-12 border-t border-border/70 pt-10 md:mt-14 md:space-y-14">
              {showGoalSection && sections.goal && (
                <Section title="What I'm trying to do">
                  <Prose>{sections.goal}</Prose>
                </Section>
              )}

              {sections.context && (
                <Section title="The challenge / context">
                  <Prose>{sections.context}</Prose>
                </Section>
              )}

              {(summary.skillNames.length > 0 ||
                summary.serviceNames.length > 0) && (
                <Section title="What kind of expertise I'm looking for">
                  <div className="grid gap-8 sm:grid-cols-2">
                    {summary.skillNames.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted">
                          Relevant expertise
                        </h3>
                        <div className="mt-3">
                          <ExpertisePills names={summary.skillNames} />
                        </div>
                      </div>
                    )}
                    {summary.serviceNames.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted">
                          Kind of help
                        </h3>
                        <div className="mt-3">
                          <ExpertisePills names={summary.serviceNames} />
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {sections.additional && (
                <Section title="Additional details">
                  <Prose>{sections.additional}</Prose>
                </Section>
              )}

              <Section title="About the person who posted this">
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                  <p className="font-heading text-xl font-semibold text-secondary">
                    {companyLabel}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {businessTypeLabel}
                    {locationLabel ? ` · ${locationLabel}` : ""}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                    Connect if your expertise is relevant. After that,
                    conversations happen directly — AI Task Pages doesn&apos;t
                    manage payments or the work itself.
                  </p>
                </div>
              </Section>
            </div>
          </div>

          <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <TaskInterestSidebar
              requirementId={requirementId}
              posterLabel={companyLabel}
              budgetLabel={budgetLabel}
              viewer={interestViewer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
