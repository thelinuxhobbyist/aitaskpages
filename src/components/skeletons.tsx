import { PageHero } from "@/components/page-hero";
import { Skeleton } from "@/components/ui/skeleton";

function ExpertResultCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="hidden h-4 w-24 sm:block" />
      </div>
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <div className="mt-5 flex gap-2">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading page">
      <PageHero innerClassName="py-16 md:py-20">
        <Skeleton className="h-12 w-3/4 max-w-xl md:h-16" />
        <Skeleton className="mt-3 h-12 w-2/3 max-w-lg md:h-14" />
        <Skeleton className="mt-6 h-5 w-full max-w-xl" />
        <Skeleton className="mt-2 h-5 w-5/6 max-w-lg" />
        <div className="mt-8 flex h-[3.75rem] w-full max-w-[560px] items-center rounded-[14px] border border-border/80 bg-card p-1.5 shadow-lift">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="ml-1.5 h-12 w-36 rounded-[9px]" />
        </div>
      </PageHero>
      <div className="mx-auto max-w-6xl space-y-6 px-5 py-14">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="mt-4 h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading experts">
      <PageHero>
        <Skeleton className="h-8 w-40 md:h-9" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        <div className="mt-6 flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:items-center">
          <Skeleton className="h-11 flex-1 rounded-lg" />
          <Skeleton className="h-11 w-full rounded-md sm:w-24" />
        </div>
        <div className="mt-6 flex justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-40 rounded-lg" />
        </div>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
          <div className="mb-8 hidden space-y-6 lg:block">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ExpertResultCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TasksPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading tasks">
      <PageHero>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-9 w-72" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        <div className="mt-6 flex gap-3">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,380px),1fr))]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="mt-4 h-6 w-5/6" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
              <div className="mt-5 flex gap-2">
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PostTaskPageSkeleton() {
  return (
    <div
      className="mx-auto max-w-3xl px-4 py-10 md:py-12"
      aria-busy="true"
      aria-label="Loading post a task"
    >
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-6 h-8 w-48 md:h-9" />
      <Skeleton className="mt-3 h-4 w-full max-w-lg" />
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-3/4" />
        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaskDetailSkeleton() {
  return (
    <div
      className="mx-auto max-w-3xl px-4 py-10 md:py-12"
      aria-busy="true"
      aria-label="Loading task"
    >
      <Skeleton className="h-8 w-32" />
      <Skeleton className="mt-8 h-9 w-3/4" />
      <Skeleton className="mt-4 h-4 w-40" />
      <div className="mt-8 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="mt-10 h-40 w-full rounded-2xl" />
    </div>
  );
}

export function ExpertProfileSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading expert profile">
      <PageHero>
        <Skeleton className="h-4 w-28" />
        <div className="mt-6 flex items-start gap-5">
          <Skeleton className="h-20 w-20 rounded-full md:h-24 md:w-24" />
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 py-10 md:grid md:grid-cols-[minmax(0,1fr)_280px] md:gap-10">
        <div className="space-y-8">
          <div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />
          </div>
          <div>
            <Skeleton className="h-3 w-16" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          </div>
        </div>
        <Skeleton className="mt-8 h-64 rounded-2xl md:mt-0" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-3 h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-6 shadow-soft"
      aria-busy="true"
      aria-label="Loading dashboard content"
    >
      <Skeleton className="h-6 w-40" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <div className="mt-6 space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}
