import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TaskDescriptionBody } from "@/app/tasks/task-description-body";
import {
  TaskInterestSidebar,
  TaskMobileCta,
  type TaskInterestViewer,
} from "@/app/tasks/task-interest-sidebar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SuccessBanner } from "@/components/ui/success-banner";
import { getAuthIdentity, getOrCreateUser } from "@/lib/auth";
import { getPublicPosterProfile, PUBLIC_PROFILE_STATUS } from "@/lib/directory";
import {
  formatRequirementLocation,
  getBusinessTypeLabel,
  getRequirementCompanyLabel,
  toPublicSummary,
} from "@/lib/requirement-utils";
import { getRequirementById, hasExpertInterest } from "@/lib/requirements";
import { createPageMetadata, taskPageDescription } from "@/lib/seo";
import { taskBodyNarrative, taskOpeningSummary } from "@/lib/task-description";
import { cn, formatBudgetGBP } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

function formatPostedDate(value: string): string {
  const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
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
    <section className="border-t border-border/80 pt-10">
      <h2 className="font-heading text-xl font-semibold tracking-tight text-secondary md:text-[1.35rem]">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TagList({ names }: { names: string[] }) {
  if (names.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {names.map((name) => (
        <li
          key={name}
          className="rounded-full bg-surface-container px-3 py-1 text-sm font-medium text-on-surface"
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="font-heading text-[1.0625rem] font-semibold tracking-tight text-secondary sm:text-lg md:text-xl">
        {value}
        <span className="ml-2 font-sans text-sm font-normal text-muted sm:hidden">
          — {label}
        </span>
      </p>
      <p className="mt-1 hidden text-sm text-muted sm:block">{label}</p>
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
  const narrative = taskBodyNarrative(requirement.description);
  const opening = taskOpeningSummary(requirement.description);
  const expertiseTags = [
    ...summary.skillNames,
    ...summary.serviceNames.filter(
      (name) => !summary.skillNames.includes(name)
    ),
  ];
  const postedLabel = formatPostedDate(requirement.createdAt);
  const locationValue =
    requirement.location?.trim() ||
    (requirement.remoteOk ? "Remote" : "Not specified");
  const workingValue = requirement.remoteOk
    ? "Remote welcome"
    : "On-site / in person";

  const [posterProfile, alreadyInterested] = await Promise.all([
    getPublicPosterProfile(requirement.clientUserId),
    viewer?.profile &&
    viewer.profile.status === PUBLIC_PROFILE_STATUS &&
    identity?.emailVerified &&
    !isOwner
      ? hasExpertInterest(requirementId, viewer.profile.id)
      : Promise.resolve(false),
  ]);

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
        alreadyInterested,
      };
    }
  }

  const interestProps = {
    requirementId,
    posterLabel: companyLabel,
    viewer: interestViewer,
  };

  return (
    <div className="relative pb-24 lg:pb-0">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-gradient-task"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
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
            "mt-8 grid items-start gap-12",
            "lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:gap-16 xl:gap-20"
          )}
        >
          <div className="min-w-0">
            <p className="text-sm text-muted">Posted {postedLabel}</p>

            <h1 className="mt-3 text-balance font-heading text-[2.15rem] font-bold tracking-[-0.03em] text-secondary md:text-5xl md:leading-[1.08] lg:text-[3.15rem] lg:leading-[1.06]">
              {requirement.title}
            </h1>

            {opening ? (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-[1.25rem] md:leading-relaxed">
                {opening}
              </p>
            ) : null}

            {expertiseTags.length > 0 && (
              <div className="mt-6">
                <TagList names={expertiseTags} />
              </div>
            )}

            <dl className="mt-8 space-y-2.5 border-y border-border/80 py-4 sm:grid sm:grid-cols-3 sm:gap-8 sm:space-y-0 sm:py-5">
              <div>
                <dt className="sr-only">Guide budget</dt>
                <dd>
                  <Fact
                    label="Guide budget"
                    value={budgetLabel ?? "To discuss"}
                  />
                </dd>
              </div>
              <div>
                <dt className="sr-only">Location</dt>
                <dd>
                  <Fact label="Location" value={locationValue} />
                </dd>
              </div>
              <div>
                <dt className="sr-only">Working together</dt>
                <dd>
                  <Fact label="Working together" value={workingValue} />
                </dd>
              </div>
            </dl>

            {isOwner && (
              <p className="mt-6">
                <Link
                  href={`/dashboard/requirements/${requirementId}`}
                  className="text-sm font-medium text-on-surface underline-offset-4 hover:underline"
                >
                  Edit request
                </Link>
              </p>
            )}

            <div className="mt-12 space-y-0 md:mt-14">
              {narrative.challenge && (
                <Section title="The challenge / context">
                  <TaskDescriptionBody text={narrative.challenge} />
                </Section>
              )}

              {summary.skillNames.length > 0 && (
                <Section title="What kind of expertise I'm looking for">
                  <TagList names={summary.skillNames} />
                </Section>
              )}

              {summary.serviceNames.length > 0 && (
                <Section title="What I need help with">
                  <TagList names={summary.serviceNames} />
                </Section>
              )}

              {narrative.additional && (
                <Section title="Additional details">
                  <TaskDescriptionBody text={narrative.additional} />
                </Section>
              )}

              <Section title="About the person who posted this">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <Avatar
                    src={posterProfile?.profileImageUrl}
                    alt={companyLabel}
                    className="h-14 w-14"
                    textClassName="text-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-xl font-semibold tracking-tight text-secondary">
                      {companyLabel}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {[
                        businessTypeLabel,
                        locationLabel,
                        posterProfile?.headline?.trim(),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {posterProfile && (
                      <Link
                        href={`/experts/${posterProfile.slug}`}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface underline-offset-4 hover:underline"
                      >
                        View profile
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                      Connect if your expertise is relevant. After that,
                      conversations happen directly — AI Task Pages doesn&apos;t
                      manage payments or the work itself.
                    </p>
                  </div>
                </div>
              </Section>
            </div>
          </div>

          <div className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
            <TaskInterestSidebar {...interestProps} />
          </div>
        </div>
      </div>

      <TaskMobileCta {...interestProps} />
    </div>
  );
}
