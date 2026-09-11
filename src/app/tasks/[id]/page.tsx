import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RequirementInterestPanel } from "@/app/tasks/requirement-interest-panel";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { SuccessBanner } from "@/components/ui/success-banner";
import {
  formatRequirementLocation,
  getRequirementCompanyLabel,
  toPublicSummary,
} from "@/lib/requirement-utils";
import { getRequirementById } from "@/lib/requirements";
import { createPageMetadata } from "@/lib/seo";
import { cn, formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { ArrowLeft, Building2, MapPin, Wallet } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ posted?: string }>;
};

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

function TaskSection({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2>{title}</h2>
      {intro ? <p className="section-lead max-w-2xl">{intro}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function FactCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-soft">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </p>
      <p className="mt-2 font-semibold leading-snug text-secondary">{value}</p>
    </div>
  );
}

function TaskTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-surface-container-high px-3 py-1.5 text-sm font-medium leading-tight text-on-surface-variant">
      {children}
    </span>
  );
}

function TagGroup({
  title,
  intro,
  names,
}: {
  title: string;
  intro: string;
  names: string[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-7">
      <h3>{title}</h3>
      <p className="mt-2 text-base leading-relaxed text-muted">{intro}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {names.map((name) => (
          <li key={name}>
            <TaskTag>{name}</TaskTag>
          </li>
        ))}
      </ul>
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

  const { posted } = await searchParams;
  const justPosted = posted === "1";

  const summary = toPublicSummary(requirement);
  const companyLabel = getRequirementCompanyLabel(
    requirement.companyName,
    requirement.businessType
  );
  const locationLabel = formatRequirementLocation(
    requirement.location,
    requirement.remoteOk
  );
  const budgetLabel = formatBudgetGBP(requirement.budget);
  const hasLookingFor =
    summary.skillNames.length > 0 || summary.serviceNames.length > 0;
  const bothTagGroups =
    summary.skillNames.length > 0 && summary.serviceNames.length > 0;

  return (
    <>
      <PageHero innerClassName="max-w-3xl px-4 py-10 md:py-12">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All tasks
          </Link>
        </Button>

        {justPosted && (
          <div className="mt-6">
            <SuccessBanner title="Your task is now live.">
              <p>
                Matching experts will be notified. You can manage it from{" "}
                <Link
                  href={`/dashboard/requirements/${requirementId}`}
                  className="font-medium underline underline-offset-2"
                >
                  your dashboard
                </Link>
                .
              </p>
            </SuccessBanner>
          </div>
        )}

        <p className="mt-6 text-xs font-medium uppercase tracking-widest text-muted">
          Open task
        </p>
        <h1 className="mt-2">{requirement.title}</h1>
        <p className="mt-3 text-muted">
          Posted by {companyLabel} · {formatDateTime(requirement.createdAt)}
        </p>

        <dl
          className={cn(
            "mt-8 grid gap-3",
            budgetLabel && locationLabel
              ? "sm:grid-cols-3"
              : budgetLabel || locationLabel
                ? "sm:grid-cols-2"
                : "sm:grid-cols-1"
          )}
        >
          <div>
            <dt className="sr-only">Company</dt>
            <dd>
              <FactCard
                icon={Building2}
                label="Company"
                value={companyLabel}
              />
            </dd>
          </div>
          {budgetLabel && (
            <div>
              <dt className="sr-only">Estimated budget</dt>
              <dd>
                <FactCard
                  icon={Wallet}
                  label="Estimated budget"
                  value={budgetLabel}
                />
              </dd>
            </div>
          )}
          {locationLabel && (
            <div>
              <dt className="sr-only">Location</dt>
              <dd>
                <FactCard
                  icon={MapPin}
                  label="Location"
                  value={locationLabel}
                />
              </dd>
            </div>
          )}
        </dl>
      </PageHero>

      <div className="mx-auto max-w-3xl space-y-14 px-4 py-10 md:py-14">
        <TaskSection
          title="Description"
          intro="What this business is trying to achieve, and the help they need."
        >
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
            <p className="whitespace-pre-wrap text-[1.0625rem] leading-[1.75] text-on-surface">
              {requirement.description}
            </p>
          </div>
        </TaskSection>

        {hasLookingFor && (
          <TaskSection
            title="What they're looking for"
            intro="Skills, technologies and the kind of help that would be a good fit."
          >
            <div
              className={cn(
                "grid gap-5",
                bothTagGroups && "md:grid-cols-2"
              )}
            >
              {summary.skillNames.length > 0 && (
                <TagGroup
                  title="Expertise"
                  intro="Skills and technologies relevant to this task."
                  names={summary.skillNames}
                />
              )}
              {summary.serviceNames.length > 0 && (
                <TagGroup
                  title="Help needed"
                  intro="The kind of work or outcome they want help with."
                  names={summary.serviceNames}
                />
              )}
            </div>
          </TaskSection>
        )}

        <RequirementInterestPanel requirementId={requirementId} />
      </div>
    </>
  );
}
