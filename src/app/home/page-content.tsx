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
            AI Jobs Market connects UK businesses with independent AI experts.
            Find an expert for your project, or post a task and let the right
            specialists come to you.
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

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-14">
          <h2>What is AI Jobs Market?</h2>
          <p className="section-lead max-w-3xl">
            We are the UK&apos;s AI expert directory and task marketplace — a
            place for businesses that need AI work done to connect with people
            who can deliver it.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "AI expert profiles",
                body: "Independent consultants showcase skills, services and availability so businesses can discover the right specialist.",
              },
              {
                title: "AI tasks & requirements",
                body: "Post a project need — automation, integrations, chatbots, ML or custom AI — and invite experts to express interest.",
              },
              {
                title: "Direct connections",
                body: "Review interested experts, compare profiles and message them yourself. We stay out of contracts and payments.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-base leading-[1.65] text-muted">
                  {item.body}
                </p>
              </div>
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
              description="Project requirements from UK businesses looking for AI expertise. Experts can express interest."
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
              title="Related AI vacancies"
              description="Optional listings from UK employers for visitors exploring careers — separate from the expert marketplace."
              browseHref="/jobs"
              browseLabel="Browse vacancies"
              secondary
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

      <div className="mx-auto max-w-6xl px-5 pb-14">
        <JoinAsExpertCta />
      </div>
    </>
  );
}
