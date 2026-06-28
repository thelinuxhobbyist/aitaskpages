import Link from "next/link";
import type { Metadata } from "next";
import { ExpertSearchForm } from "@/app/experts/expert-search-form";
import { SearchFiltersPanel } from "@/app/search/search-filters";
import { SearchResultRow } from "@/app/search/search-result-row";
import { searchExperts, getDistinctLocations } from "@/lib/directory";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import { createPageMetadata } from "@/lib/seo";
import { getActiveFilters } from "@/lib/search-url";
import { parseDirectoryFilters } from "@/lib/validations/directory";
import { ArrowLeft, Search, Users, X } from "lucide-react";

export const metadata: Metadata = createPageMetadata({
  title: "Search AI experts",
  description:
    "Search UK AI experts on AI Jobs Market by skills, services, location, and hourly rate.",
  path: "/search",
});

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseDirectoryFilters(params);
  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  const [skills, services, locations] = await Promise.all([
    getAllSkills(),
    getAllServices(),
    getDistinctLocations(),
  ]);

  const profiles = hasFilters ? await searchExperts(filters) : [];

  const skillLabels = new Map(skills.map((s) => [s.slug, s.name]));
  const serviceLabels = new Map(services.map((s) => [s.slug, s.name]));
  const activeFilters = getActiveFilters(filters, {
    skills: skillLabels,
    services: serviceLabels,
  });

  const queryLabel = filters.q?.trim();
  const countLabel = `${profiles.length} expert${profiles.length !== 1 ? "s" : ""}`;

  return (
    <>
      {/* Page header */}
      <section className="border-b border-border bg-surface-container">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to directory
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-primary">
                Expert search
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-secondary md:text-3xl">
                {hasFilters
                  ? queryLabel
                    ? `Results for “${queryLabel}”`
                    : "Filtered results"
                  : "Find an expert"}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-muted">
                {hasFilters ? (
                  <>
                    <Users className="h-4 w-4 shrink-0" />
                    <span>
                      {countLabel} found
                      {activeFilters.length > 1 &&
                        ` · ${activeFilters.length} filters applied`}
                    </span>
                  </>
                ) : (
                  "Search by name, skills, location, or use the filters to narrow results."
                )}
              </p>
            </div>

            {/* Quick search — always visible in the header */}
            <div className="w-full md:max-w-md">
              <ExpertSearchForm
                variant="inline"
                skills={skills}
                services={services}
                locations={locations}
                current={filters}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main layout: sidebar + results */}
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          <SearchFiltersPanel
            skills={skills}
            services={services}
            locations={locations}
            current={filters}
          />

          <main className="min-w-0">
            {/* Active filter chips */}
            {activeFilters.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">
                  Active:
                </span>
                {activeFilters.map((filter) => (
                  <Link
                    key={filter.key}
                    href={filter.href}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-sm text-on-surface transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    {filter.label}
                    <X className="h-3.5 w-3.5 text-muted" aria-hidden />
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

            {/* Post requirement prompt */}
            {hasFilters && (
              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/[0.04] px-5 py-4">
                <p className="text-sm font-medium text-secondary">
                  Can&apos;t find the right expert?
                </p>
                <p className="mt-1 text-sm text-muted">
                  Post a requirement instead and let matching AI experts come to
                  you.
                </p>
                <Link
                  href="/dashboard/requirements/new"
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Post a requirement →
                </Link>
              </div>
            )}

            {/* Results — only after the user searches or applies a filter */}
            {!hasFilters ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container">
                  <Search className="h-6 w-6 text-muted" />
                </div>
                <p className="text-lg font-semibold text-secondary">
                  Start your search
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                  Enter a keyword above or use the filters to find AI experts
                  across the UK.
                </p>
              </div>
            ) : profiles.length > 0 ? (
              <div className="space-y-3">
                {profiles.map((profile) => (
                  <SearchResultRow key={profile.id} profile={profile} />
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
                  <Link href="/search" className="font-medium text-primary hover:underline">
                    start a new search
                  </Link>
                  . You can also{" "}
                  <Link
                    href="/dashboard/requirements/new"
                    className="font-medium text-primary hover:underline"
                  >
                    post a requirement
                  </Link>{" "}
                  and let experts come to you.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
