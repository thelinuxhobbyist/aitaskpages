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
import { ArrowUpRight, MapPin, Star } from "lucide-react";

export function ExpertCard({ profile }: { profile: ProfileWithRelations }) {
  const roleText = profile.headline?.trim();

  // What they can do (priority 2, visually prominent)
  const bioCleaned = profile.bio?.replace(/\r\n/g, "\n").trim();
  const canHelpWith =
    bioCleaned ||
    roleText ||
    "AI specialist available to help with projects, consulting, and implementation.";

  // Existing specialisms / skills
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

  const visibleSpecialisms = uniqueSpecialisms.slice(0, 5);
  const extraSpecialismsCount = Math.max(
    0,
    uniqueSpecialisms.length - visibleSpecialisms.length
  );

  const hasMeta = Boolean(
    profile.availability || profile.location || profile.hourlyRate != null
  );

  const hasExternalLinks = Boolean(
    profile.websiteUrl?.trim() ||
      profile.linkedinUrl?.trim() ||
      profile.githubUrl?.trim()
  );

  return (
    <article className="group relative flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-md cursor-pointer sm:p-6">
      <div>
        {/* 1. Header: Avatar + Expert Name & Role */}
        <header className="flex items-start gap-3.5 sm:gap-4">
          <Avatar
            src={profile.profileImageUrl}
            alt={profile.fullName}
            className="h-14 w-14 shrink-0 sm:h-16 sm:w-16"
            textClassName="text-xl font-semibold"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold tracking-tight text-secondary transition-colors group-hover:text-primary sm:text-xl">
                <Link
                  href={`/experts/${profile.slug}`}
                  className="focus:outline-none after:absolute after:inset-0 after:z-0 after:rounded-2xl"
                >
                  {profile.fullName}
                </Link>
              </h3>

              {profile.featured && (
                <Badge variant="featured" className="shrink-0 gap-1 text-xs">
                  <Star className="h-3 w-3 fill-current" />
                  Featured
                </Badge>
              )}
            </div>

            {roleText && (
              <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-600 sm:text-base">
                {roleText}
              </p>
            )}
          </div>
        </header>

        {/* 2. What they can do (Most Important) */}
        <section className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Can help with
          </p>
          <p className="mt-1.5 line-clamp-3 text-[0.9375rem] leading-relaxed text-slate-800 sm:text-base">
            {canHelpWith}
          </p>
        </section>

        {/* 3. Existing specialisms / skills */}
        {visibleSpecialisms.length > 0 && (
          <section className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Specialisms
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {visibleSpecialisms.map((name) => (
                <Badge
                  key={name}
                  variant="secondary"
                  className="rounded-md border border-border/50 px-2.5 py-1 text-xs font-normal"
                >
                  {name}
                </Badge>
              ))}
              {extraSpecialismsCount > 0 && (
                <Badge
                  variant="secondary"
                  className="rounded-md border border-border/50 px-2.5 py-1 text-xs font-normal text-muted"
                >
                  +{extraSpecialismsCount} more
                </Badge>
              )}
            </div>
          </section>
        )}

        {/* 4 & 5. Availability and Location */}
        {hasMeta && (
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
            {profile.availability && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 font-medium",
                  profile.availability === "available"
                    ? "text-emerald-700"
                    : profile.availability === "limited"
                    ? "text-amber-700"
                    : "text-muted"
                )}
              >
                <span
                  className={cn(
                    "h-2.5 w-2.5 shrink-0 rounded-full",
                    profile.availability === "available"
                      ? "bg-emerald-500"
                      : profile.availability === "limited"
                      ? "bg-amber-500"
                      : "bg-slate-400"
                  )}
                  aria-hidden
                />
                {AVAILABILITY_LABELS[profile.availability] ??
                  profile.availability}
              </span>
            )}

            {profile.location && (
              <span className="inline-flex items-center gap-1 text-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted/70" />
                {profile.location}
              </span>
            )}

            {profile.hourlyRate != null && (
              <span className="font-semibold text-secondary">
                £{profile.hourlyRate}/hr
              </span>
            )}
          </div>
        )}
      </div>

      {/* 6. Subtle divider before external links */}
      {hasExternalLinks && (
        <footer className="mt-5 border-t border-border/60 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {profile.websiteUrl?.trim() && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-3.5 py-1.5 text-xs font-medium text-secondary shadow-xs transition-colors hover:border-primary/50 hover:bg-surface-container hover:text-primary active:bg-surface-container-high"
              >
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted" />
                Website
              </a>
            )}
            {profile.linkedinUrl?.trim() && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-3.5 py-1.5 text-xs font-medium text-secondary shadow-xs transition-colors hover:border-primary/50 hover:bg-surface-container hover:text-primary active:bg-surface-container-high"
              >
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted" />
                LinkedIn
              </a>
            )}
            {profile.githubUrl?.trim() && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-3.5 py-1.5 text-xs font-medium text-secondary shadow-xs transition-colors hover:border-primary/50 hover:bg-surface-container hover:text-primary active:bg-surface-container-high"
              >
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted" />
                GitHub
              </a>
            )}
          </div>
        </footer>
      )}
    </article>
  );
}
