import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import {
  AVAILABILITY_LABELS,
  parseCustomServices,
  parseCustomSkills,
  type ProfileWithRelations,
} from "@/lib/profile-utils";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin } from "lucide-react";

type Variant = "row" | "grid";

function uniqueSpecialisms(profile: ProfileWithRelations): string[] {
  const customSkills = parseCustomSkills(profile.customSkills);
  const customServices = parseCustomServices(profile.customServices);
  const all = [
    ...profile.services.map((s) => s.service.name),
    ...customServices,
    ...profile.skills.map((s) => s.skill.name),
    ...customSkills,
  ];

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const item of all) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }
  return unique;
}

function AvailabilityDot({
  availability,
}: {
  availability: string | null | undefined;
}) {
  const label = availability
    ? AVAILABILITY_LABELS[availability] ?? availability
    : "Available now";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium",
        availability === "available" || !availability
          ? "text-emerald-700"
          : availability === "limited"
            ? "text-amber-700"
            : "text-muted",
      )}
    >
      <span
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          availability === "available" || !availability
            ? "bg-emerald-500"
            : availability === "limited"
              ? "bg-amber-500"
              : "bg-slate-400",
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}

export function ExpertPreviewCard({
  profile,
  variant = "row",
  heading: Heading = variant === "grid" ? "h3" : "h2",
}: {
  profile: ProfileWithRelations;
  variant?: Variant;
  heading?: "h2" | "h3";
}) {
  const roleText = profile.headline?.trim();
  const focusAreas = uniqueSpecialisms(profile).slice(0, 3);
  const bioCleaned = profile.bio?.replace(/\r\n/g, "\n").trim();
  const bioSnippet =
    bioCleaned ||
    roleText ||
    "AI specialist available to help with projects, consulting, and implementation.";
  const locationText = profile.location?.trim() || null;

  return (
    <Link
      href={`/experts/${profile.slug}`}
      aria-label={`View ${profile.fullName}'s profile`}
      className={cn(
        "group relative flex cursor-pointer rounded-2xl border border-border bg-card text-left shadow-soft",
        "transition-[transform,box-shadow,border-color] duration-200",
        "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        "active:translate-y-0 active:shadow-soft",
        variant === "grid"
          ? "h-full flex-col justify-between p-5 sm:p-6"
          : "flex-col p-5 sm:p-6",
      )}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        <Avatar
          src={profile.profileImageUrl}
          alt={profile.fullName}
          className="h-12 w-12 shrink-0 ring-2 ring-border/60 sm:h-14 sm:w-14"
          textClassName="text-base font-semibold"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Heading className="font-heading text-lg font-semibold tracking-tight text-secondary transition-colors group-hover:text-primary">
                {profile.fullName}
              </Heading>
              {roleText && (
                <p className="mt-0.5 line-clamp-1 text-sm text-muted">
                  {roleText}
                </p>
              )}
            </div>
            <span className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary sm:inline-flex">
              View profile
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
        {bioSnippet}
      </p>

      {focusAreas.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {focusAreas.map((area) => (
            <li
              key={area}
              className="inline-flex items-center rounded-full border border-transparent bg-surface-container-high px-2.5 py-1 text-[0.8125rem] font-medium leading-tight text-on-surface-variant"
            >
              {area}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border/80 pt-4 text-sm text-muted">
        <div className="flex flex-wrap items-center gap-2">
          <AvailabilityDot availability={profile.availability} />
          {locationText && (
            <>
              <span className="text-slate-300 select-none" aria-hidden>
                ·
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {locationText}
              </span>
            </>
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary sm:hidden">
          View profile
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
