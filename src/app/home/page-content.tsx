import Link from "next/link";
import { ExpertCard } from "@/app/experts/expert-card";
import { RequirementCard, taskCardGridClassName } from "@/app/tasks/requirement-card";
import { ExpertSearchForm } from "@/app/experts/expert-search-form";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { JobPreviewCard } from "@/components/home/job-preview-card";
import { JoinAsExpertCta } from "@/components/home/join-as-expert-cta";
import { PlatformSection } from "@/components/home/platform-section";
import { getFeaturedExperts } from "@/lib/directory";
import { getLatestJobs } from "@/lib/jobs";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { getLatestOpenRequirements } from "@/lib/requirements";
import { PageHero } from "@/components/page-hero";
import { ArrowRight, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export async function HomePage() {
  const jobsPromise = getLatestJobs(6);
  let experts: Awaited<ReturnType<typeof getFeaturedExperts>> = [];
  let requirements: Awaited<ReturnType<typeof getLatestOpenRequirements>> = [];
  let skills: Awaited<ReturnType<typeof getAllSkills>> = [];
  let services: Awaited<ReturnType<typeof getAllServices>> = [];

  let directoryUnavailable = false;

  try {
    experts = await getFeaturedExperts(6);
    requirements = await getLatestOpenRequirements(6);
    skills = await getAllSkills();
    services = await getAllServices();
  } catch (error) {
    directoryUnavailable = true;
    console.error(
      "HomePage data load failed",
      error,
      error instanceof Error ? error.cause : undefined,
    );
  }

  const jobs = await jobsPromise;

  const hasExperts = experts.length > 0;
  const hasTasks = requirements.length > 0;
  const hasJobs = jobs.length > 0;

  return (
    <>
      <PageHero innerClassName="py-16 md:py-20">
          <h1 className="max-w-3xl text-[clamp(2.375rem,5vw,3.875rem)] font-bold leading-[1.04] tracking-[-0.02em]">
            Find the AI expertise
            <br />
            <span className="text-accent-foreground">you need.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.6] text-muted md:text-xl md:leading-[1.65]">
            AI Jobs Market is an introduction platform connecting UK businesses
            with independent AI experts. Find an expert directly, or post what
            you need and let relevant specialists come to you.
          </p>
          <p className="mt-4 max-w-xl text-[1.0625rem] font-medium leading-[1.5] text-on-surface md:text-lg">
            We make the introduction. You take it from there.
          </p>

          <ExpertSearchForm
            variant="hero"
            skills={skills}
            services={services}
            locations={[]}
          />

          <div className="mt-5 flex max-w-[560px] flex-wrap gap-x-7 gap-y-2 pl-1">
            {[
              {
                href: "/tasks/new",
                label: "Post a task",
                primary: true,
              },
              { href: "/tasks", label: "Browse tasks", primary: false },
              {
                href: "/join-as-expert",
                label: "Join as an expert",
                primary: false,
              },
            ].map((item) => (
              <Link
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
              </Link>
            ))}
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

      <div className="mx-auto max-w-6xl px-5 py-14">
        <HowItWorks />
      </div>

      <FeaturedCategories />

      {directoryUnavailable && (
        <div className="mx-auto max-w-6xl px-5 pb-14">
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-8 text-center">
            <p className="text-lg font-semibold text-secondary">
              Experts and tasks are temporarily unavailable
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
              Nothing has been removed from the site. The directory should be
              back after 1am UK time. AI vacancies below are unaffected.
            </p>
          </div>
        </div>
      )}

      {(hasExperts || hasTasks) && (
        <div className="mx-auto max-w-6xl space-y-14 px-5 py-14">
          {hasExperts && (
            <PlatformSection
              id="experts"
              title="Featured AI experts"
              description="Independent UK consultants for AI consulting, automation, integrations and machine learning."
              browseHref="/search"
              browseLabel="Browse all experts"
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
              description="What UK businesses need help with — experts can express interest so you can connect directly."
              browseHref="/tasks"
              browseLabel="Browse all tasks"
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

      <div className="mx-auto max-w-6xl px-5 pb-14">
        <JoinAsExpertCta />
      </div>

      {hasJobs && (
        <div className="mx-auto max-w-6xl px-5 pb-14">
          <PlatformSection
            id="jobs"
            title="Looking for an AI career?"
            description="Traditional employment opportunities from UK employers. These vacancies are separate from the expert directory and introduction platform."
            browseHref="/jobs"
            browseLabel="Browse AI vacancies"
            secondary
          >
            <div className="grid gap-4 md:grid-cols-2">
              {jobs.map((job) => (
                <JobPreviewCard key={job.jobId} job={job} />
              ))}
            </div>
          </PlatformSection>
        </div>
      )}
    </>
  );
}
