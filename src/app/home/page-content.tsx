import Link from "next/link";
import { ExpertCard } from "@/app/experts/expert-card";
import { RequirementCard, taskCardGridClassName } from "@/app/tasks/requirement-card";
import { ExpertSearchForm } from "@/app/experts/expert-search-form";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { JobPreviewCard } from "@/components/home/job-preview-card";
import { PlatformSection } from "@/components/home/platform-section";
import { getFeaturedExperts } from "@/lib/directory";
import { getLatestJobs } from "@/lib/jobs";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { getLatestOpenRequirements } from "@/lib/requirements";
import { ArrowRight, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export async function HomePage() {
  const [experts, requirements, jobs, skills, services] = await Promise.all([
    getFeaturedExperts(6),
    getLatestOpenRequirements(6),
    getLatestJobs(6),
    getAllSkills(),
    getAllServices(),
  ]);

  const hasExperts = experts.length > 0;
  const hasTasks = requirements.length > 0;
  const hasJobs = jobs.length > 0;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-hero"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h1 className="max-w-3xl text-[clamp(2.375rem,5vw,3.875rem)] font-bold leading-[1.04] tracking-[-0.02em]">
            Find and hire
            <br />
            AI experts{" "}
            <span className="text-accent-foreground">in minutes.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.6] text-muted md:text-xl md:leading-[1.65]">
            Search specialists directly or post your AI task. Review profiles,
            compare skills and connect with the people who can actually ship it.
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
                href: "/dashboard/requirements/new",
                label: "Post a task",
                primary: true,
              },
              { href: "/tasks", label: "Browse tasks", primary: false },
              { href: "/jobs", label: "Browse AI jobs", primary: false },
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
            {["No commissions", "No contracts", "No platform fees"].map(
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
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14">
        <HowItWorks />
      </div>

      <FeaturedCategories />

      {(hasExperts || hasTasks || hasJobs) && (
        <div className="mx-auto max-w-6xl space-y-14 px-5 py-14">
          {hasExperts && (
            <PlatformSection
              id="experts"
              title="Featured AI experts"
              description="Profiles from our UK expert directory."
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
              title="Latest AI tasks"
              description="Open projects from UK businesses looking for AI expertise."
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

          {hasJobs && (
            <PlatformSection
              id="jobs"
              title="Latest AI jobs"
              description="Full-time, contract, and remote AI roles across the United Kingdom."
              browseHref="/jobs"
              browseLabel="Browse all jobs"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {jobs.map((job) => (
                  <JobPreviewCard key={job.jobId} job={job} />
                ))}
              </div>
            </PlatformSection>
          )}
        </div>
      )}
    </>
  );
}
