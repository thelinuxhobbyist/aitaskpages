import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AVAILABILITY_LABELS, parseCustomSkills, type ProfileWithRelations } from "@/lib/profile-utils";
import { MapPin, Star } from "lucide-react";

export function ExpertCard({ profile }: { profile: ProfileWithRelations }) {
  const customSkills = parseCustomSkills(profile.customSkills);
  const catalogSkills = profile.skills.slice(0, 4);
  const extraCatalog = Math.max(0, profile.skills.length - catalogSkills.length);
  const customShown = customSkills.slice(0, Math.max(0, 4 - catalogSkills.length));

  return (
    <Link href={`/experts/${profile.slug}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-md group-hover:border-primary/30">
        <CardHeader className="flex flex-row items-start gap-4">
          <Avatar
            src={profile.profileImageUrl}
            alt={profile.fullName}
            className="h-14 w-14"
            textClassName="text-lg"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="truncate text-lg group-hover:text-primary">
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
              <CardDescription className="mt-1.5 line-clamp-2 text-[0.9375rem]">
                {profile.headline}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-[0.9375rem] text-muted">
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

          {(catalogSkills.length > 0 || customShown.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {catalogSkills.map(({ skill }) => (
                <Badge key={skill.id} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
              {customShown.map((name) => (
                <Badge key={name} variant="secondary">
                  {name}
                </Badge>
              ))}
              {(extraCatalog > 0 || customSkills.length > customShown.length) && (
                <Badge variant="secondary">
                  +
                  {extraCatalog + customSkills.length - customShown.length}{" "}
                  more
                </Badge>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </Link>
  );
}
