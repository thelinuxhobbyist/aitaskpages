import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Service, Skill } from "@/db/schema";
import type { DirectoryFilters } from "@/lib/validations/directory";
import { Search } from "lucide-react";

type Props = {
  action?: string;
  skills: Skill[];
  services: Service[];
  locations: string[];
  current?: DirectoryFilters;
  /** Compact hero-style bar vs full filter panel vs inline header bar. */
  variant?: "hero" | "full" | "inline";
};

export function ExpertSearchForm({
  action = "/search",
  skills,
  services,
  locations,
  current = {},
  variant = "full",
}: Props) {
  const selectClass =
    "flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

  if (variant === "inline") {
    return (
      <form method="GET" action={action}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              id="q"
              name="q"
              defaultValue={current.q ?? ""}
              placeholder="e.g. machine learning consultant in London"
              className="h-11 bg-white pl-9"
              autoComplete="off"
            />
          </div>
          <Button type="submit" className="shrink-0">
            Search
          </Button>
        </div>
      </form>
    );
  }

  if (variant === "hero") {
    return (
      <form method="GET" action={action} className="mt-8 max-w-2xl">
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-lift sm:flex-row">
          <div className="relative flex flex-1 items-center gap-3 px-3">
            <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
            <Input
              id="q"
              name="q"
              defaultValue={current.q ?? ""}
              placeholder="Search by skill, service or location…"
              className="h-11 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
              autoComplete="off"
              aria-label="Search experts"
            />
          </div>
          <Button type="submit" variant="ink" size="lg" className="rounded-xl">
            Search experts
          </Button>
        </div>
        <p className="mt-3 text-sm">
          <Link
            href="/search"
            className="font-medium text-muted underline-offset-4 hover:text-on-surface hover:underline"
          >
            Advanced search with filters
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form
      method="GET"
      action={action}
      className="rounded-[6px] border border-border bg-surface p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="q">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              id="q"
              name="q"
              defaultValue={current.q ?? ""}
              placeholder="e.g. machine learning consultant in London"
              className="pl-9"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="skill">Skill</Label>
          <select
            id="skill"
            name="skill"
            defaultValue={current.skill ?? ""}
            className={selectClass}
          >
            <option value="">All skills</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.slug}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <select
            id="service"
            name="service"
            defaultValue={current.service ?? ""}
            className={selectClass}
          >
            <option value="">All services</option>
            {services.map((service) => (
              <option key={service.id} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            list="location-suggestions"
            defaultValue={current.location ?? ""}
            placeholder="e.g. London"
          />
          <datalist id="location-suggestions">
            {locations.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minRate">Min rate (£/hr)</Label>
          <Input
            id="minRate"
            name="minRate"
            type="number"
            min={0}
            defaultValue={current.minRate ?? ""}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxRate">Max rate (£/hr)</Label>
          <Input
            id="maxRate"
            name="maxRate"
            type="number"
            min={0}
            defaultValue={current.maxRate ?? ""}
            placeholder="500"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="submit">Search</Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/search">Clear filters</Link>
        </Button>
      </div>
    </form>
  );
}
