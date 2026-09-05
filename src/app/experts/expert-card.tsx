import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AVAILABILITY_LABELS,
  parseCustomServices,
  parseCustomSkills,
  type ProfileWithRelations,
} from "@/lib/profile-utils";
import { cn } from "@/lib/utils";
import { ChevronRight, MapPin } from "lucide-react";

export function ExpertCard({ profile }: { profile: ProfileWithRelations }) {
  // 1. Role / Headline
  const roleText = profile.headline?.trim();

  // 2. Metadata with fallbacks
  const availability = profile.availability;
  const availabilityLabel = availability
    ? AVAILABILITY_LABELS[availability] ?? availability
    : "Available now";

  const locationText = profile.location?.trim() || null;
  const rateText =
    profile.hourlyRate != null ? `£${profile.hourlyRate}/hr` : null;

  // 3. Bio snippet (strictly 2 lines, no heading)
  const bioCleaned = profile.bio?.replace(/\r\n/g, "\n").trim();
  const bioSnippet =
    bioCleaned ||
    roleText ||
    "AI specialist available to help with projects, consulting, and implementation.";

  // 4. Skills / Specialisms
  const customSkills = parseCustomSkills(profile.customSkills);
  const customServices = parseCustomServices(profile.customServices);

  const allSpecialisms = [
    ...profile.services.map((s) => s.service.name),
    ...customServices,
    ...profile.skills.map((s) => s.skill.name),
    ...customSkills,
  ];

  const uniqueSpecialisms: string[] = [];
  const seenSpecialisms = new Set<string>();
  for (const item of allSpecialisms) {
    const key = item.toLowerCase();
    if (!seenSpecialisms.has(key)) {
      seenSpecialisms.add(key);
      uniqueSpecialisms.push(item);
    }
  }

  // Cap mobile scrollable pills to top 10 for performance
  const displaySpecialisms = uniqueSpecialisms.slice(0, 10);
  const desktopVisibleCount = 5;
  const extraDesktopCount = Math.max(
    0,
    uniqueSpecialisms.length - desktopVisibleCount
  );

  return (
    <Link
      href={`/experts/${profile.slug}`}
      className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:p-5"
    >
      <div>
        {/* 1. Header Row: Avatar, Full Name, Headline, and right-aligned Chevron */}
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar
            src={profile.profileImageUrl}
            alt={profile.fullName}
            className="h-12 w-12 shrink-0 sm:h-14 sm:w-14"
            textClassName="text-base font-semibold"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-lg font-semibold tracking-tight text-secondary transition-colors group-hover:text-primary">
                  {profile.fullName}
                </h3>

                {roleText && (
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted">
                    {roleText}
                  </p>
                )}
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-muted/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
          </div>
        </div>

        {/* 2. Metadata Bar: Availability status • Location (optional) • Hourly Rate (optional) */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 font-medium",
              availability === "available" || !availability
                ? "text-emerald-700"
                : availability === "limited"
                ? "text-amber-700"
                : "text-muted"
            )}
          >
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                availability === "available" || !availability
                  ? "bg-emerald-500"
                  : availability === "limited"
                  ? "bg-amber-500"
                  : "bg-slate-400"
              )}
              aria-hidden
            />
            {availabilityLabel}
          </span>

          {locationText && (
            <>
              <span className="text-slate-300 select-none" aria-hidden>
                •
              </span>

              <span className="inline-flex items-center gap-1 text-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted/70" />
                {locationText}
              </span>
            </>
          )}

          {rateText && (
            <>
              <span className="text-slate-300 select-none" aria-hidden>
                •
              </span>

              <span className="font-semibold text-secondary">{rateText}</span>
            </>
          )}
        </div>

        {/* 3. Bio Preview: Exactly 2 lines max with CSS line-clamp (no section heading) */}
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">
          {bioSnippet}
        </p>
      </div>

      {/* 4. Skills Row: Clean tag pills (no section heading) */}
      {displaySpecialisms.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
          {displaySpecialisms.map((name, index) => (
            <Badge
              key={name}
              variant="secondary"
              className={cn(
                "shrink-0 rounded-md border border-border/50 px-2 py-0.5 text-xs font-medium text-secondary md:shrink",
                index >= desktopVisibleCount && "md:hidden"
              )}
            >
              {name}
            </Badge>
          ))}
          {extraDesktopCount > 0 && (
            <Badge
              variant="secondary"
              className="hidden shrink-0 rounded-md border border-border/50 px-2 py-0.5 text-xs font-medium text-muted md:inline-flex"
            >
              +{extraDesktopCount} more
            </Badge>
          )}
        </div>
      )}
    </Link>
  );
}
