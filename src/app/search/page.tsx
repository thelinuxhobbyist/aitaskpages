import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ExpertSearchForm } from "@/app/experts/expert-search-form";
import { SearchFiltersPanel } from "@/app/search/search-filters";
import { SearchResultRow } from "@/app/search/search-result-row";
import { SearchSortSelect } from "@/app/search/search-sort";
import { getActiveFilters } from "@/lib/search-url";
import { sortSearchResults } from "@/lib/search-match-utils";
import { searchExperts, getDistinctLocations } from "@/lib/directory";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { createPageMetadata } from "@/lib/seo";
import { parseDirectoryFilters } from "@/lib/validations/directory";
import { Search, Users } from "lucide-react";

export const metadata: Metadata = createPageMetadata({
  title: "AI Experts",
  description:
    "Browse independent UK AI experts on AI Jobs Market. Search by skills, services and location — we make the introduction, you take it from there.",
  path: "/search",
});

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchContextLabel(
  filters: ReturnType<typeof parseDirectoryFilters>,
  skillLabels: Map<string, string>,
  serviceLabels: Map<string, string>
): string | null {
  if (filters.q?.trim()) return filters.q.trim();
  if (filters.location?.trim()) return filters.location.trim();
  if (filters.skill) return skillLabels.get(filters.skill) ?? filters.skill;
  if (filters.service)
    return serviceLabels.get(filters.service) ?? filters.service;
  return null;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseDirectoryFilters(params);
  const hasFilters = Object.entries(filters).some(
    ([key, value]) => key !== "sort" && value !== undefined && value !== ""
  );

  let skills: Awaited<ReturnType<typeof getAllSkills>> = [];
  let services: Awaited<ReturnType<typeof getAllServices>> = [];
  let locations: Awaited<ReturnType<typeof getDistinctLocations>> = [];
  let rawProfiles: Awaited<ReturnType<typeof searchExperts>> = [];
  let directoryUnavailable = false;

  try {
    skills = await getAllSkills();
    services = await getAllServices();
    locations = await getDistinctLocations();
    rawProfiles = await searchExperts(filters);
  } catch (error) {
    directoryUnavailable = true;
    console.error(
      "SearchPage data load failed",
      error,
      error instanceof Error ? error.cause : undefined,
    );
  }

  const profiles = sortSearchResults(rawProfiles, filters.sort);

  const skillLabels = new Map(skills.map((s) => [s.slug, s.name]));
  const serviceLabels = new Map(services.map((s) => [s.slug, s.name]));
  const activeFilters = getActiveFilters(filters, {
    skills: skillLabels,
    services: serviceLabels,
  });

  const searchContext = getSearchContextLabel(
    filters,
    skillLabels,
    serviceLabels
  );
  const countLabel = hasFilters
    ? `${profiles.length} AI expert${profiles.length !== 1 ? "s" : ""} found`
    : `${profiles.length} AI expert${profiles.length !== 1 ? "s" : ""}`;

  return (
    <>
      <section className="border-b border-border bg-surface-container">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-secondary md:text-3xl">
            AI Experts
          </h1>
          {!hasFilters && (
            <p className="mt-2 max-w-2xl text-base text-muted">
              Browse independent AI experts across the UK. Search by skill, or
              post a task and let specialists come to you. We make the
              introduction — you take it from there.
            </p>
          )}

          {hasFilters && searchContext && (
            <p className="mt-2 text-base text-muted">
              Search:{" "}
              <span className="font-medium text-secondary">{searchContext}</span>
            </p>
          )}

          <div className="mt-6 w-full max-w-xl">
            <ExpertSearchForm
              variant="inline"
              skills={skills}
              services={services}
              locations={locations}
              current={filters}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-sm text-muted">
              <Users className="h-4 w-4 shrink-0" />
              {directoryUnavailable
                ? "Directory temporarily unavailable"
                : countLabel}
            </p>
            <Suspense fallback={null}>
              <SearchSortSelect />
            </Suspense>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
          <SearchFiltersPanel
            skills={skills}
            services={services}
            locations={locations}
            current={filters}
          />

          <main className="min-w-0">
            {activeFilters.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {activeFilters.map((filter) => (
                  <Link
                    key={filter.key}
                    href={filter.href}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-sm text-on-surface transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    {filter.label}
                    <span aria-hidden className="text-muted">
                      ×
                    </span>
                    <span className="sr-only">Remove filter</span>
                  </Link>
                ))}
                {activeFilters.length > 1 && (
                  <Link
                    href="/search"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Clear all
                  </Link>
                )}
              </div>
            )}

            {hasFilters && (
              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/[0.04] px-5 py-4">
                <p className="text-sm font-medium text-secondary">
                  Can&apos;t find the right expert?
                </p>
                <p className="mt-1 text-sm text-muted">
                  Post a task and let matching AI experts come to you. We make
                  the introduction; you take it from there.
                </p>
                <Link
                  href="/dashboard/requirements/new"
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Post a task →
                </Link>
              </div>
            )}

            {directoryUnavailable ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container">
                  <Users className="h-6 w-6 text-muted" />
                </div>
                <p className="text-lg font-semibold text-secondary">
                  Experts are temporarily unavailable
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                  Expert profiles have not been removed. We can&apos;t load the
                  directory just now — please try again after 1am UK time.
                </p>
              </div>
            ) : !hasFilters && profiles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container">
                  <Users className="h-6 w-6 text-muted" />
                </div>
                <p className="text-lg font-semibold text-secondary">
                  No experts listed yet
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                  Check back soon, or{" "}
                  <Link
                    href="/join-as-expert"
                    className="font-medium text-primary hover:underline"
                  >
                    join as an expert
                  </Link>
                  .
                </p>
              </div>
            ) : profiles.length > 0 ? (
              <div className="flex flex-col gap-4">
                {profiles.map((profile) => (
                  <SearchResultRow
                    key={profile.id}
                    profile={profile}
                    filters={filters}
                    skillLabels={skillLabels}
                    serviceLabels={serviceLabels}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container">
                  <Search className="h-6 w-6 text-muted" />
                </div>
                <p className="text-lg font-semibold text-secondary">
                  No experts match your search
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                  Try broader keywords, remove a filter, or{" "}
                  <Link
                    href="/search"
                    className="font-medium text-primary hover:underline"
                  >
                    start a new search
                  </Link>
                  .
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
