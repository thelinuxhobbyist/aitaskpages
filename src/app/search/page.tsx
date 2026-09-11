import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ExpertCard } from "@/app/experts/expert-card";
import { ExpertSearchForm } from "@/app/experts/expert-search-form";
import { CantFindExpertCta } from "@/app/search/cant-find-expert-cta";
import { SearchFiltersPanel } from "@/app/search/search-filters";
import { ProfileTypeTabs } from "@/app/search/profile-type-tabs";
import { SearchResultRow } from "@/app/search/search-result-row";
import { SearchSortSelect } from "@/app/search/search-sort";
import { PageHero } from "@/components/page-hero";
import { EXPERT_DIRECTORY_LIMITS } from "@/lib/directory-limits";
import { getActiveFilters } from "@/lib/search-url";
import { sortSearchResults } from "@/lib/search-match-utils";
import {
  searchExperts,
  getDistinctLocations,
  getRecentExperts,
} from "@/lib/directory";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { createPageMetadata } from "@/lib/seo";
import {
  hasActiveFilters,
  parseDirectoryFilters,
} from "@/lib/validations/directory";
import { Search, Users } from "lucide-react";

export const metadata: Metadata = createPageMetadata({
  title: "Find AI Expertise",
  description:
    "Find AI professionals and companies on AI Task Pages. Search by skills, services and location — we make the introduction, you take it from there.",
  path: "/search",
});

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function listingNoun(
  count: number,
  type: "individual" | "company" | undefined
): string {
  if (type === "individual") {
    return count === 1 ? "AI professional" : "AI professionals";
  }
  if (type === "company") {
    return count === 1 ? "company" : "companies";
  }
  return count === 1 ? "result" : "results";
}

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

function EmptyPanel({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Search;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container">
        <Icon className="h-6 w-6 text-muted" />
      </div>
      <p className="text-lg font-semibold text-secondary">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{children}</p>
    </div>
  );
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseDirectoryFilters(params);
  const searched = hasActiveFilters(filters);

  let skills: Awaited<ReturnType<typeof getAllSkills>> = [];
  let services: Awaited<ReturnType<typeof getAllServices>> = [];
  let locations: Awaited<ReturnType<typeof getDistinctLocations>> = [];
  let rawProfiles: Awaited<ReturnType<typeof searchExperts>> = [];
  let recentProfiles: Awaited<ReturnType<typeof getRecentExperts>> = [];
  let directoryUnavailable = false;

  try {
    skills = await getAllSkills();
    services = await getAllServices();
    locations = await getDistinctLocations();
    if (searched) {
      rawProfiles = await searchExperts(filters);
    } else {
      // Default state: a small, fixed set of the newest experts so the page has
      // content without listing everyone on the platform.
      recentProfiles = await getRecentExperts(
        EXPERT_DIRECTORY_LIMITS.defaultCards
      );
    }
  } catch (error) {
    directoryUnavailable = true;
    console.error(
      "SearchPage data load failed",
      error,
      error instanceof Error ? error.cause : undefined,
    );
  }

  const matched = sortSearchResults(rawProfiles, filters.sort);
  const results = matched.slice(0, EXPERT_DIRECTORY_LIMITS.maxSearchResults);
  const resultsTruncated = matched.length > results.length;

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

  const shownCount = searched ? results.length : recentProfiles.length;
  const resultCount = searched ? matched.length : shownCount;
  const countLabel = searched
    ? `${resultCount} ${listingNoun(resultCount, filters.type)} found`
    : `${shownCount} ${listingNoun(shownCount, filters.type)}`;

  return (
    <>
      <PageHero>
          <h1 className="text-2xl font-semibold tracking-tight text-secondary md:text-3xl">
            Find AI Expertise
          </h1>
          {!searched && (
            <p className="mt-2 max-w-2xl text-base text-muted">
              Search by skill, service or location to find AI professionals and
              companies. Or post a task and let specialists come to you.
            </p>
          )}

          {searched && searchContext && (
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

          <div className="mt-6 space-y-4">
            <ProfileTypeTabs current={filters} />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-sm text-muted">
                <Users className="h-4 w-4 shrink-0" />
                {directoryUnavailable
                  ? "Directory temporarily unavailable"
                  : countLabel}
              </p>
              {searched && results.length > 0 && (
                <Suspense fallback={null}>
                  <SearchSortSelect />
                </Suspense>
              )}
            </div>
          </div>
      </PageHero>

      <div className="mx-auto max-w-6xl px-5 py-8 md:py-10">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16 xl:gap-20">
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

            {directoryUnavailable ? (
              <EmptyPanel icon={Users} title="Directory temporarily unavailable">
                Profiles have not been removed. We can&apos;t load the directory
                just now — please try again shortly.
              </EmptyPanel>
            ) : !searched ? (
              recentProfiles.length > 0 ? (
                <section aria-labelledby="recent-experts-heading">
                  <h2
                    id="recent-experts-heading"
                    className="text-lg font-semibold text-secondary"
                  >
                    Recently added
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Search above to find AI professionals and companies by
                    skill, service or location.
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {recentProfiles.map((profile) => (
                      <ExpertCard key={profile.id} profile={profile} />
                    ))}
                  </div>
                </section>
              ) : (
                <EmptyPanel icon={Users} title="No listings yet">
                  We&apos;re onboarding the first AI professionals and companies
                  now. Post a task and we&apos;ll match you as soon as they
                  join.
                </EmptyPanel>
              )
            ) : results.length > 0 ? (
              <section aria-labelledby="search-results-heading">
                <h2 id="search-results-heading" className="sr-only">
                  Search results
                </h2>
                <div className="flex flex-col gap-4">
                  {results.map((profile) => (
                    <SearchResultRow key={profile.id} profile={profile} />
                  ))}
                </div>
                {resultsTruncated && (
                  <p className="mt-6 text-sm text-muted">
                    Showing the first {results.length} matches. Add a filter or
                    more keywords to narrow things down.
                  </p>
                )}
              </section>
            ) : (
              <EmptyPanel icon={Search} title="No matches for your search">
                Try broader keywords, remove a filter, or{" "}
                <Link
                  href="/search"
                  className="font-medium text-primary hover:underline"
                >
                  start a new search
                </Link>
                .
              </EmptyPanel>
            )}

            {!directoryUnavailable && <CantFindExpertCta />}
          </main>
        </div>
      </div>
    </>
  );
}
