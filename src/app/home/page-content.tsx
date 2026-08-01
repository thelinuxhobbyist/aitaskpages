import Link from "next/link";
import { ExpertCard } from "@/app/experts/expert-card";
import { RequirementCard, taskCardGridClassName } from "@/app/tasks/requirement-card";
import { ExpertSearchForm } from "@/app/experts/expert-search-form";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { JobPreviewCard } from "@/components/home/job-preview-card";
import { PlatformSection } from "@/components/home/platform-section";
import { Button } from "@/components/ui/button";
import { getFeaturedExperts } from "@/lib/directory";
import { getLatestJobs } from "@/lib/jobs";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { getLatestOpenRequirements } from "@/lib/requirements";
import { ArrowRight, CircleCheck } from "lucide-react";

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
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Find and hire AI experts in minutes.
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-[1.65] text-muted">
            Search specialists directly or post your AI task. Review profiles,
            compare skills and connect with the people who can actually ship it.
          </p>

          <ExpertSearchForm
            variant="hero"
            skills={skills}
            services={services}
            locations={[]}
          />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild variant="ink" size="lg" className="rounded-xl">
              <Link href="/dashboard/requirements/new">
                Post a task
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-border bg-card shadow-soft hover:bg-surface-container"
            >
              <Link href="/jobs.html">
                Browse jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[0.9375rem] leading-snug text-muted md:text-base">
            {["No commissions", "No contracts", "No platform fees"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CircleCheck className="h-4 w-4 text-accent-foreground" />
                {item}
              </span>
            ))}
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
              browseHref="/jobs.html"
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
