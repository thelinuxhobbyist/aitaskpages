import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AVAILABILITY_LABELS, type ProfileWithRelations } from "@/lib/profile-utils";
import { getProfileMatchLabels } from "@/lib/search-match-utils";
import type { DirectoryFilters } from "@/lib/validations/directory";
import { Check, ChevronRight, Code2, Globe, MapPin, Star } from "lucide-react";

type Props = {
  profile: ProfileWithRelations;
  filters: DirectoryFilters;
  skillLabels: Map<string, string>;
  serviceLabels: Map<string, string>;
};

export function SearchResultRow({
  profile,
  filters,
  skillLabels,
  serviceLabels,
}: Props) {
  const matches = getProfileMatchLabels(profile, filters, {
    skills: skillLabels,
    services: serviceLabels,
  });

  const summary =
    profile.bio?.split("\n")[0]?.slice(0, 120) ??
    profile.headline ??
    "AI expert available for hire in the UK.";

  return (
    <Link
      href={`/experts/${profile.slug}`}
      className="group flex gap-4 rounded-xl border border-border bg-surface p-4 transition-all hover:border-primary/30 hover:shadow-md md:gap-5 md:p-5"
    >
      <Avatar
        src={profile.profileImageUrl}
        alt={profile.fullName}
        className="h-16 w-16 shrink-0 md:h-20 md:w-20"
        textClassName="text-xl"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-secondary group-hover:text-primary md:text-xl">
            {profile.fullName}
          </h2>
          {profile.featured && (
            <Badge variant="featured" className="gap-1">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </Badge>
          )}
        </div>

        {profile.headline && (
          <p className="mt-1 line-clamp-1 text-sm text-muted md:text-base">
            {profile.headline}
          </p>
        )}

        <p className="mt-1 line-clamp-1 text-sm text-muted">{summary}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {profile.location && (
            <span className="flex items-center gap-1 text-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {profile.location}
            </span>
          )}
          {profile.hourlyRate != null && (
            <span className="font-semibold text-on-surface">
              £{profile.hourlyRate}/hr
            </span>
          )}
          {profile.availability && (
            <span
              className={
                profile.availability === "available"
                  ? "font-medium text-emerald-600"
                  : "text-muted"
              }
            >
              {AVAILABILITY_LABELS[profile.availability] ?? profile.availability}
            </span>
          )}
        </div>

        {profile.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 5).map(({ skill }) => (
              <Badge key={skill.id} variant="secondary" className="text-xs">
                {skill.name}
              </Badge>
            ))}
            {profile.skills.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{profile.skills.length - 5}
              </Badge>
            )}
          </div>
        )}

        {(profile.githubUrl || profile.websiteUrl) && (
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-primary">
            {profile.githubUrl && (
              <span className="inline-flex items-center gap-1">
                <Code2 className="h-3.5 w-3.5" />
                GitHub
              </span>
            )}
            {profile.websiteUrl && (
              <span className="inline-flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                Website
              </span>
            )}
          </div>
        )}

        {matches.length > 0 && (
          <div className="mt-3 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2">
            <p className="text-xs font-semibold text-secondary">
              Matches your search
            </p>
            <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
              {matches.map((label) => (
                <li
                  key={label}
                  className="flex items-center gap-1 text-xs text-muted"
                >
                  <Check className="h-3 w-3 text-emerald-600" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="hidden shrink-0 items-center self-center sm:flex">
        <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          View profile
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
