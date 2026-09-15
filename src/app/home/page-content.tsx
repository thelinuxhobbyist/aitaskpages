import Link from "next/link";
import { Suspense } from "react";
import { ExpertCard } from "@/app/experts/expert-card";
import { RequirementCard, taskCardGridClassName } from "@/app/tasks/requirement-card";
import { ExpertSearchForm } from "@/app/experts/expert-search-form";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { JoinAsExpertCta } from "@/components/home/join-as-expert-cta";
import { PlatformSection } from "@/components/home/platform-section";
import { DocumentLink } from "@/components/document-link";
import { HomeSectionsSkeleton } from "@/components/skeletons";
import { getFeaturedExperts } from "@/lib/directory";
import { getLatestOpenRequirements } from "@/lib/requirements";
import { PageHero } from "@/components/page-hero";
import { ArrowRight, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function HomeHero() {
  return (
    <PageHero innerClassName="py-16 md:py-20">
      <h1 className="max-w-3xl text-[clamp(2.375rem,5vw,3.875rem)] font-bold leading-[1.04] tracking-[-0.02em]">
        Find the right AI expertise
        <br />
        <span className="text-accent-foreground">for your task.</span>
      </h1>
      <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.6] text-muted md:text-xl md:leading-[1.65]">
        AI Task Pages helps businesses and individuals connect with AI experts
        for specific tasks, projects and challenges. Post a task, or find the
        right expertise and get in touch directly.
      </p>
      <p className="mt-4 max-w-xl text-[1.0625rem] font-medium leading-[1.5] text-on-surface md:text-lg">
        We make the introduction. You take it from there.
      </p>

      <ExpertSearchForm
        variant="hero"
        skills={[]}
        services={[]}
        locations={[]}
      />

      <div className="mt-5 flex max-w-[560px] flex-wrap gap-x-7 gap-y-2 pl-1">
        {[
          {
            href: "/tasks/new",
            label: "Post a task",
            primary: true,
          },
          { href: "/search", label: "Find AI experts", primary: false },
          { href: "/tasks", label: "Browse AI tasks", primary: false },
          {
            href: "/create-a-profile",
            label: "Create a profile",
            primary: false,
          },
        ].map((item) => {
          const ItemLink = item.href === "/tasks/new" ? DocumentLink : Link;
          return (
            <ItemLink
              key={item.href}
              href={item.href}
              className={cn(
                "group inline-flex items-center gap-1.5 text-[0.90625rem] font-semibold transition-colors",
                item.primary
                  ? "text-accent-foreground hover:text-ink"
                  : "text-on-surface hover:text-accent-foreground",
              )}
            >
              {item.label}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </ItemLink>
          );
        })}
      </div>

      <div className="mt-5 flex max-w-[560px] flex-wrap gap-x-4 gap-y-1.5 border-t border-border/80 pt-5 pl-1 text-[0.8125rem] text-muted">
        {["Connect directly", "No commissions", "You agree terms directly"].map(
          (item) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <CircleCheck
                className="h-3.5 w-3.5 shrink-0 text-accent-foreground"
                strokeWidth={2.4}
              />
              {item}
            </span>
          ),
        )}
      </div>
    </PageHero>
  );
}

async function HomePlatformSections() {
  let experts: Awaited<ReturnType<typeof getFeaturedExperts>> = [];
  let requirements: Awaited<ReturnType<typeof getLatestOpenRequirements>> = [];
  let directoryUnavailable = false;

  try {
    [experts, requirements] = await Promise.all([
      getFeaturedExperts(6),
      getLatestOpenRequirements(6),
    ]);
  } catch (error) {
    directoryUnavailable = true;
    console.error(
      "HomePage platform data load failed",
      error,
      error instanceof Error ? error.cause : undefined,
    );
  }

  const hasExperts = experts.length > 0;
  const hasTasks = requirements.length > 0;

  if (!directoryUnavailable && !hasExperts && !hasTasks) {
    return null;
  }

  return (
    <>
      {directoryUnavailable && (
        <div className="mx-auto max-w-6xl px-5 pb-14">
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-8 text-center">
            <p className="text-lg font-semibold text-secondary">
              Listings and tasks are temporarily unavailable
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
              Nothing has been removed from the site. The directory should be
              back shortly.
            </p>
          </div>
        </div>
      )}

      {(hasExperts || hasTasks) && (
        <div className="mx-auto max-w-6xl space-y-14 px-5 py-14">
          {hasExperts && (
            <PlatformSection
              id="experts"
              title="Featured AI expertise"
              description="Independent professionals and companies for AI consulting, automation, integrations and machine learning."
              browseHref="/search"
              browseLabel="Browse AI experts"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {experts.map((profile) => (
                  <ExpertCard key={profile.id} profile={profile} />
                ))}
              </div>
            </PlatformSection>
          )}

          {hasTasks && (
            <PlatformSection
              id="tasks"
              title="Open AI tasks"
              description="Open requests looking for AI help — professionals and companies can express interest so you can connect directly."
              browseHref="/tasks"
              browseLabel="Browse AI tasks"
            >
              <div className={taskCardGridClassName}>
                {requirements.map((req) => (
                  <RequirementCard key={req.id} requirement={req} />
                ))}
              </div>
            </PlatformSection>
          )}
        </div>
      )}
    </>
  );
}

export function HomePage() {
  return (
    <>
      <HomeHero />

      <div className="mx-auto max-w-6xl px-5 py-14">
        <HowItWorks />
      </div>

      <FeaturedCategories />

      <Suspense fallback={<HomeSectionsSkeleton />}>
        <HomePlatformSections />
      </Suspense>

      <div className="mx-auto max-w-6xl px-5 pb-14">
        <JoinAsExpertCta />
      </div>
    </>
  );
}
