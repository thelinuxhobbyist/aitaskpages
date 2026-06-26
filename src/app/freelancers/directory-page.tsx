import Link from "next/link";
import { DirectoryFilters } from "@/app/freelancers/directory-filters";
import { FreelancerCard } from "@/app/freelancers/freelancer-card";
import { Button } from "@/components/ui/button";
import {
  getDistinctLocations,
  getFeaturedFreelancers,
  searchFreelancers,
} from "@/lib/directory";
import { RANKING_DESCRIPTION } from "@/lib/profile-utils";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { parseDirectoryFilters } from "@/lib/validations/directory";
import { Star } from "lucide-react";

type DirectoryPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
  clearFiltersHref?: string;
};

export async function DirectoryPage({
  searchParams,
  clearFiltersHref = "/",
}: DirectoryPageProps) {
  const filters = parseDirectoryFilters(searchParams);

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  const [profiles, skills, services, locations, featured] = await Promise.all([
    searchFreelancers(filters),
    getAllSkills(),
    getAllServices(),
    getDistinctLocations(),
    hasFilters ? Promise.resolve([]) : getFeaturedFreelancers(3),
  ]);

  const featuredIds = new Set(featured.map((p) => p.id));
  const mainList =
    hasFilters || featured.length === 0
      ? profiles
      : profiles.filter((p) => !featuredIds.has(p.id));

  return (
    <>
      <section className="bg-primary-container text-on-primary-container">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <p className="text-sm font-medium uppercase tracking-wide opacity-80">
            UK AI Expert Directory
          </p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">
            Find AI freelancers &amp; consultants
          </h1>
          <p className="mt-3 max-w-2xl text-lg opacity-90">
            Discover UK AI experts for consulting, model development, and more.
            No marketplace fees — contact experts directly.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="border-primary/30 bg-surface/80">
              <Link href="/join-as-expert">Join as an expert</Link>
            </Button>
            <Button asChild variant="ghost" className="text-on-primary-container hover:bg-black/5">
              <Link href="/jobs.html">Browse AI jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <DirectoryFilters
            skills={skills}
            services={services}
            locations={locations}
            current={filters}
          />
        </div>

        {!hasFilters && featured.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <h2 className="text-lg font-medium text-on-surface">
                Featured experts
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((profile) => (
                <FreelancerCard key={profile.id} profile={profile} />
              ))}
            </div>
          </section>
        )}

        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {profiles.length} expert{profiles.length !== 1 ? "s" : ""} found
            {hasFilters ? " matching your filters" : ""}
          </p>
          <p className="text-xs text-muted">{RANKING_DESCRIPTION}</p>
        </div>

        {mainList.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mainList.map((profile) => (
              <FreelancerCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-lg font-medium text-on-surface">No experts found</p>
            <p className="mt-1 text-sm text-muted">
              Try adjusting your filters or{" "}
              <Link href={clearFiltersHref} className="text-primary hover:underline">
                clear all filters
              </Link>
              .
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}
