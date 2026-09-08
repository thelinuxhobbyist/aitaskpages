import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Service, Skill } from "@/db/schema";
import { cn } from "@/lib/utils";
import type { DirectoryFilters } from "@/lib/validations/directory";
import { Search, SlidersHorizontal } from "lucide-react";

type Props = {
  skills: Skill[];
  services: Service[];
  locations: string[];
  current: DirectoryFilters;
};

function FilterField({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <Label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-muted"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

export function SearchFiltersPanel({
  skills,
  services,
  locations,
  current,
}: Props) {
  const inputClass = "h-11 rounded-xl border-border bg-white px-4 text-sm";
  const selectClass =
    "flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  const fields = (
    <div className="space-y-7">
      {current.sort && current.sort !== "match" && (
        <input type="hidden" name="sort" value={current.sort} />
      )}
      <FilterField id="filter-q" label="Keywords">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            id="filter-q"
            name="q"
            defaultValue={current.q ?? ""}
            placeholder="e.g. AI consultant"
            className={cn(inputClass, "pl-11")}
            autoComplete="off"
          />
        </div>
      </FilterField>

      <FilterField id="filter-skill" label="Skill">
        <select
          id="filter-skill"
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
      </FilterField>

      <FilterField id="filter-service" label="Service">
        <select
          id="filter-service"
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
      </FilterField>

      <FilterField id="filter-location" label="Location">
        <Input
          id="filter-location"
          name="location"
          list="search-location-suggestions"
          defaultValue={current.location ?? ""}
          placeholder="e.g. London"
          className={inputClass}
        />
        <datalist id="search-location-suggestions">
          {locations.map((loc) => (
            <option key={loc} value={loc} />
          ))}
        </datalist>
      </FilterField>

      <FilterField id="filter-availability" label="Availability">
        <select
          id="filter-availability"
          name="availability"
          defaultValue={current.availability ?? ""}
          className={selectClass}
        >
          <option value="">Any availability</option>
          <option value="available">Available now</option>
          <option value="limited">Limited availability</option>
          <option value="unavailable">Not available</option>
        </select>
      </FilterField>

      <div className="space-y-4 rounded-xl border border-dashed border-border/80 bg-surface-container/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          More filters coming soon
        </p>
        <FilterField id="filter-experience" label="Experience">
          <select id="filter-experience" disabled className={selectClass}>
            <option>Any experience level</option>
          </select>
        </FilterField>
        <FilterField id="filter-remote" label="Remote / On-site">
          <select id="filter-remote" disabled className={selectClass}>
            <option>Any work arrangement</option>
          </select>
        </FilterField>
      </div>

      <div className="rounded-xl bg-surface-container/70 p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
          Hourly rate
        </p>
        <div className="grid grid-cols-2 gap-4">
          <FilterField id="filter-minRate" label="Min (£/hr)">
            <Input
              id="filter-minRate"
              name="minRate"
              type="number"
              min={0}
              defaultValue={current.minRate ?? ""}
              placeholder="0"
              className={inputClass}
            />
          </FilterField>
          <FilterField id="filter-maxRate" label="Max (£/hr)">
            <Input
              id="filter-maxRate"
              name="maxRate"
              type="number"
              min={0}
              defaultValue={current.maxRate ?? ""}
              placeholder="500"
              className={inputClass}
            />
          </FilterField>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-7">
        <Button type="submit" size="lg" className="h-11 w-full rounded-xl">
          Apply filters
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11 w-full rounded-xl"
          asChild
        >
          <Link href="/search">Clear all</Link>
        </Button>
      </div>
    </div>
  );

  const panelHeader = (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <SlidersHorizontal className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-base font-semibold text-secondary">Refine search</h2>
        <p className="mt-0.5 text-sm leading-relaxed text-muted">
          Narrow results by skill, location, or budget.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <details className="group mb-8 overflow-hidden rounded-2xl border border-border bg-surface md-elevation-1 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <SlidersHorizontal className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-secondary">Refine search</p>
              <p className="text-sm text-muted">Skill, location, budget</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-surface-container px-3 py-1.5 text-xs font-medium text-muted">
            <span className="group-open:hidden">Show</span>
            <span className="hidden group-open:inline">Hide</span>
          </span>
        </summary>
        <form
          method="GET"
          action="/search"
          className="border-t border-border px-6 pb-7 pt-6"
        >
          {fields}
        </form>
      </details>

      {/* Desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 overflow-hidden rounded-2xl border border-border bg-surface p-7 md-elevation-1">
          <div className="mb-8">{panelHeader}</div>
          <form method="GET" action="/search">
            {fields}
          </form>
        </div>
      </aside>
    </>
  );
}
