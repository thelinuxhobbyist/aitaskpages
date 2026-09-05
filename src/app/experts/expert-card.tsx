import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import {
  AVAILABILITY_LABELS,
  parseCustomServices,
  parseCustomSkills,
  type ProfileWithRelations,
} from "@/lib/profile-utils";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

function getFirstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "expert";
  const titlePrefixes = new Set([
    "dr",
    "dr.",
    "mr",
    "mr.",
    "mrs",
    "mrs.",
    "ms",
    "ms.",
    "prof",
    "prof.",
  ]);
  if (parts.length > 1 && titlePrefixes.has(parts[0].toLowerCase())) {
    return parts[1];
  }
  return parts[0];
}

export function ExpertCard({ profile }: { profile: ProfileWithRelations }) {
  // 1. Identity & Role
  const roleText = profile.headline?.trim();
  const firstName = getFirstName(profile.fullName);

  // 2. What they are good at: top 2-3 focus areas for instant scanning
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

  // 2–3 key focus areas (avoids marketplace category tag clutter)
  const focusAreas = uniqueSpecialisms.slice(0, 3);

  // 3. Bio / Hook (Why might they be interesting to me?)
  const bioCleaned = profile.bio?.replace(/\r\n/g, "\n").trim();
  const bioSnippet =
    bioCleaned ||
    roleText ||
    "AI specialist available to help with projects, consulting, and implementation.";

  // 4. Availability & Location metadata (pricing intentionally removed from discovery card)
  const availability = profile.availability;
  const availabilityLabel = availability
    ? AVAILABILITY_LABELS[availability] ?? availability
    : "Available now";

  const locationText = profile.location?.trim() || null;

  return (
    <Link
      href={`/experts/${profile.slug}`}
      className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:p-6"
    >
      <div className="space-y-3">
        {/* 1. Header: Avatar, Full Name, Headline */}
        <div className="flex items-start gap-3.5 sm:gap-4">
          <Avatar
            src={profile.profileImageUrl}
            alt={profile.fullName}
            className="h-12 w-12 shrink-0 ring-2 ring-border/60 sm:h-14 sm:w-14"
            textClassName="text-base font-semibold"
          />

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
        </div>

        {/* 2. Key Focus Areas (What are they good at?) */}
        {focusAreas.length > 0 && (
          <p className="text-sm font-medium leading-normal text-secondary/85">
            {focusAreas.join(" · ")}
          </p>
        )}

        {/* 3. Bio / Hook (Why might they be interesting to me?) */}
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
          {bioSnippet}
        </p>
      </div>

      {/* 4. Bottom Row: Availability • Location (left) & Connection CTA (right) */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-2 text-sm text-muted">
        <div className="inline-flex items-center gap-2">
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
                ·
              </span>
              <span className="max-w-[180px] truncate text-muted sm:max-w-[260px]">
                {locationText}
              </span>
            </>
          )}
        </div>

        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary-dark">
          <span>Meet {firstName}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
