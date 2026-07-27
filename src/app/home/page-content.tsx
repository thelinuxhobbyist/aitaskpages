import Link from "next/link";
import { ExpertCard } from "@/app/experts/expert-card";
import { RequirementCard, taskCardGridClassName } from "@/app/tasks/requirement-card";
import { ExpertSearchForm } from "@/app/experts/expert-search-form";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { JobPreviewCard } from "@/components/home/job-preview-card";
import { JoinAsExpertCta } from "@/components/home/join-as-expert-cta";
import { PlatformSection } from "@/components/home/platform-section";
import { SectionEmptyState } from "@/components/home/section-empty-state";
import { ExternalPrefetchLink } from "@/components/external-prefetch-link";
import { SoftwareFinderCta } from "@/components/home/software-finder-cta";
import { WhyChoose } from "@/components/home/why-choose";
import { Button } from "@/components/ui/button";
import { getFeaturedExperts } from "@/lib/directory";
import { getLatestJobs } from "@/lib/jobs";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { getLatestOpenRequirements } from "@/lib/requirements";
import { ArrowRight, Briefcase, CircleCheck, ClipboardList, Sparkles, Users } from "lucide-react";

export async function HomePage() {
  const [experts, requirements, jobs, skills, services] = await Promise.all([
    getFeaturedExperts(6),
    getLatestOpenRequirements(6),
    getLatestJobs(6),
    getAllSkills(),
    getAllServices(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-hero"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted shadow-soft">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            UK-built marketplace for AI talent
          </span>

          <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.05] md:text-7xl">
            Find and hire AI experts in minutes.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Search specialists directly or post your AI task. Review profiles,
            compare skills and connect with the people who can actually ship it.
          </p>

          <ExpertSearchForm
            variant="hero"
            skills={skills}
            services={services}
            locations={[]}
          />

          <div className="mt-6 flex max-w-2xl flex-wrap items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-border bg-card shadow-soft hover:bg-surface-container"
            >
              <Link href="/dashboard/requirements/new">
                Post a task
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <ExternalPrefetchLink className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-on-surface">
              <Sparkles className="h-4 w-4 text-accent-foreground" />
              Looking for AI software? Try our AI Software Finder
            </ExternalPrefetchLink>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
            {["No commissions", "No contracts", "No platform fees"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CircleCheck className="h-4 w-4 text-accent-foreground" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-5 py-20">
        <HowItWorks />
      </div>

      <FeaturedCategories />

      <div className="mx-auto max-w-6xl space-y-20 px-5 pb-20">
        <WhyChoose />

        <PlatformSection
          id="experts"
          title="Featured AI experts"
          description="Hand-picked profiles from our UK expert directory."
          browseHref="/search"
          browseLabel="Browse all experts"
        >
          {experts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {experts.map((profile) => (
                <ExpertCard key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <SectionEmptyState
              icon={Users}
              title="Featured experts coming soon"
              description="We're curating our first group of AI specialists. In the meantime, browse the directory by category or post a task to attract the right experts."
              actionLabel="Browse all experts"
              actionHref="/search"
            />
          )}
        </PlatformSection>

        <PlatformSection
          id="tasks"
          title="Latest AI tasks"
          description="Open projects from UK businesses looking for AI expertise."
          browseHref="/tasks"
          browseLabel="Browse all tasks"
        >
          {requirements.length > 0 ? (
            <div className={taskCardGridClassName}>
              {requirements.map((req) => (
                <RequirementCard key={req.id} requirement={req} />
              ))}
            </div>
          ) : (
            <SectionEmptyState
              icon={ClipboardList}
              title="No AI tasks posted yet"
              description="Be the first business to post an AI task. Describe your project and matching experts will be notified."
              actionLabel="Post a task"
              actionHref="/dashboard/requirements/new"
            />
          )}
        </PlatformSection>

        <PlatformSection
          id="jobs"
          title="Latest AI jobs"
          description="Full-time, contract, and remote AI roles across the United Kingdom."
          browseHref="/jobs.html"
          browseLabel="Browse all jobs"
        >
          {jobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {jobs.map((job) => (
                <JobPreviewCard key={job.jobId} job={job} />
              ))}
            </div>
          ) : (
            <SectionEmptyState
              icon={Briefcase}
              title="AI jobs updated regularly"
              description="Our jobs board lists the latest AI, ML, and data science roles across the UK. Check back often or browse the full board for current openings."
              actionLabel="Browse all jobs"
              actionHref="/jobs.html"
            />
          )}
        </PlatformSection>

        <SoftwareFinderCta />

        <JoinAsExpertCta />
      </div>
    </>
  );
}
