import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AVAILABILITY_LABELS, computeCompleteness, type ProfileWithRelations } from "@/lib/profile-utils";
import { MapPin, Star } from "lucide-react";

export function FreelancerCard({ profile }: { profile: ProfileWithRelations }) {
  const completeness = computeCompleteness(profile);
  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link href={`/freelancers/${profile.slug}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-md group-hover:border-primary/30">
        <CardHeader className="flex flex-row items-start gap-4">
          {profile.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profileImageUrl}
              alt={profile.fullName}
              className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary ring-2 ring-border">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="truncate text-base group-hover:text-primary">
                {profile.fullName}
              </CardTitle>
              {profile.featured && (
                <Badge variant="featured" className="gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Featured
                </Badge>
              )}
            </div>
            {profile.headline && (
              <CardDescription className="mt-1 line-clamp-2">
                {profile.headline}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </span>
            )}
            {profile.hourlyRate != null && (
              <span className="font-medium text-slate-700">
                £{profile.hourlyRate}/hr
              </span>
            )}
            {profile.availability && (
              <span
                className={
                  profile.availability === "available"
                    ? "text-emerald-600"
                    : undefined
                }
              >
                {AVAILABILITY_LABELS[profile.availability] ?? profile.availability}
              </span>
            )}
          </div>

          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 4).map(({ skill }) => (
                <Badge key={skill.id} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
              {profile.skills.length > 4 && (
                <Badge variant="secondary">+{profile.skills.length - 4}</Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-primary/60"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-xs text-muted">{completeness}%</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
