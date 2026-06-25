import Link from "next/link";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "AI Experts Directory | AI Jobs Market",
  description:
    "Find UK AI freelancers and consultants. Search by skills, services, location, and hourly rate.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FreelancersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseDirectoryFilters(params);

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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">AI Experts</h1>
          <p className="mt-1 text-muted">
            Discover UK AI freelancers and consultants for your next project.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/join-as-expert">Join as an expert</Link>
        </Button>
      </div>

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
            <h2 className="text-lg font-semibold text-secondary">
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
          <p className="text-lg font-medium text-secondary">No experts found</p>
          <p className="mt-1 text-sm text-muted">
            Try adjusting your filters or{" "}
            <Link href="/freelancers" className="text-primary hover:underline">
              clear all filters
            </Link>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
