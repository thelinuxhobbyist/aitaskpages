import Link from "next/link";
import { ExpertCard } from "@/app/experts/expert-card";
import { ExpertSearchForm } from "@/app/experts/expert-search-form";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { JobPreviewCard } from "@/components/home/job-preview-card";
import { JoinAsExpertCta } from "@/components/home/join-as-expert-cta";
import { PlatformSection } from "@/components/home/platform-section";
import { RequirementPreviewCard } from "@/components/home/requirement-preview-card";
import { SectionEmptyState } from "@/components/home/section-empty-state";
import { WhyChoose } from "@/components/home/why-choose";
import { Button } from "@/components/ui/button";
import { getFeaturedExperts } from "@/lib/directory";
import { getLatestJobs } from "@/lib/jobs";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { getLatestOpenRequirements } from "@/lib/requirements";
import { ArrowRight, Briefcase, ClipboardList, Users } from "lucide-react";

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
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-primary-container text-on-primary-container">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] opacity-80">
              AI Jobs Market
            </p>
            <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-[2.75rem] md:leading-tight">
              Find AI experts or post your AI requirement
            </h1>
            <p className="mt-4 text-lg leading-relaxed opacity-90 md:text-xl">
              Search experienced AI consultants across the UK, or describe what
              you need and let matching experts come to you.
            </p>
          </div>

          <ExpertSearchForm
            variant="hero"
            skills={skills}
            services={services}
            locations={[]}
          />

          <div className="mt-6 max-w-3xl">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/25 bg-white/70 text-on-primary-container hover:bg-white"
            >
              <Link href="/dashboard/requirements/new">
                Post a requirement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Static + dynamic sections ─────────────────────────────────── */}
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 md:space-y-20 md:py-16">
        <HowItWorks />

        <FeaturedCategories />

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
              description="We're curating our first group of AI specialists. In the meantime, browse the directory by category or post a requirement to attract the right experts."
              actionLabel="Browse all experts"
              actionHref="/search"
            />
          )}
        </PlatformSection>

        <PlatformSection
          id="requirements"
          title="Latest AI requirements"
          description="Open projects from UK businesses looking for AI expertise."
          browseHref="/requirements"
          browseLabel="Browse all requirements"
        >
          {requirements.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {requirements.map((req) => (
                <RequirementPreviewCard key={req.id} requirement={req} />
              ))}
            </div>
          ) : (
            <SectionEmptyState
              icon={ClipboardList}
              title="No AI requirements posted yet"
              description="Be the first business to post an AI requirement. Describe your project and matching experts will be notified."
              actionLabel="Post a requirement"
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

        <JoinAsExpertCta />
      </div>
    </>
  );
}
