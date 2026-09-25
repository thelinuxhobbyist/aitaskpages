"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
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

function FilterFields({
  skills,
  services,
  locations,
  current,
}: Props) {
  const [profileType, setProfileType] = useState<"all" | "individual" | "company">(
    current.type ?? "all"
  );
  const showIndividualFilters = profileType !== "company";

  const inputClass = "h-11 rounded-xl border-border bg-white px-4 text-sm";
  const selectClass =
    "flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div className="space-y-7">
      {current.sort && current.sort !== "match" && (
        <input type="hidden" name="sort" value={current.sort} />
      )}

      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wider text-muted">
          Profile type
        </legend>
        <div className="grid gap-2">
          {(
            [
              { value: "all", label: "All" },
              { value: "individual", label: "Individuals" },
              { value: "company", label: "Companies" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors",
                profileType === option.value
                  ? "border-primary/40 bg-primary/5 font-medium text-on-surface"
                  : "border-border bg-white text-on-surface-variant hover:border-primary/20",
              )}
            >
              <input
                type="radio"
                name="type"
                value={option.value}
                checked={profileType === option.value}
                onChange={() => setProfileType(option.value)}
                className="h-4 w-4 border-border text-primary focus:ring-primary"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

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
          placeholder="City, region or remote"
          className={inputClass}
        />
        <datalist id="search-location-suggestions">
          {locations.map((loc) => (
            <option key={loc} value={loc} />
          ))}
        </datalist>
      </FilterField>

      {showIndividualFilters && (
        <>
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

          <div className="space-y-4 rounded-xl border border-dashed border-border/80 bg-accent-muted/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              More filters in a future update
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

          <div className="rounded-xl bg-accent-muted/70 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
              Hourly rate
            </p>
            {profileType === "all" && (
              <p className="mb-4 text-xs leading-relaxed text-muted">
                Applies to individuals. Experts set their own currency, so
                treat this as a rough range. Companies without a rate still
                appear in All results.
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <FilterField id="filter-minRate" label="Min / hour">
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
              <FilterField id="filter-maxRate" label="Max / hour">
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
        </>
      )}

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
}

export function SearchFiltersPanel({
  skills,
  services,
  locations,
  current,
}: Props) {
  const fieldsProps = { skills, services, locations, current };

  const panelHeader = (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <SlidersHorizontal className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-base font-semibold text-secondary">Refine search</h2>
        <p className="mt-0.5 text-sm leading-relaxed text-muted">
          Narrow results by profile type, skill, or location.
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
              <p className="text-sm text-muted">Type, skill, location</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-accent-muted px-3 py-1.5 text-xs font-medium text-muted">
            <span className="group-open:hidden">Show</span>
            <span className="hidden group-open:inline">Hide</span>
          </span>
        </summary>
        <form
          method="GET"
          action="/search"
          className="border-t border-border px-6 pb-7 pt-6"
        >
          <FilterFields key={current.type ?? "all"} {...fieldsProps} />
        </form>
      </details>

      {/* Desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 overflow-hidden rounded-2xl border border-border bg-surface p-7 md-elevation-1">
          <div className="mb-8">{panelHeader}</div>
          <form method="GET" action="/search">
            <FilterFields key={`${current.type ?? "all"}-desktop`} {...fieldsProps} />
          </form>
        </div>
      </aside>
    </>
  );
}
