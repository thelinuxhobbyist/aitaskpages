import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PublicRequirementSummary } from "@/lib/requirement-utils";
import { formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { Building2, MapPin, Wallet } from "lucide-react";

export function RequirementCard({
  requirement,
}: {
  requirement: PublicRequirementSummary;
}) {
  return (
    <Link href={`/requirements/${requirement.id}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-md group-hover:border-primary/30">
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <CardTitle className="text-base group-hover:text-primary">
              {requirement.title}
            </CardTitle>
            <time className="shrink-0 text-xs text-muted">
              {formatDateTime(requirement.createdAt)}
            </time>
          </div>
          <CardDescription className="flex items-center gap-1.5 text-sm">
            <Building2 className="h-3.5 w-3.5" />
            {requirement.businessTypeLabel}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="line-clamp-3 text-sm text-slate-600">
            {requirement.descriptionExcerpt}
          </p>

          <div className="flex flex-wrap gap-3 text-sm text-muted">
            {requirement.budget && (
              <span className="flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5" />
                Est. {formatBudgetGBP(requirement.budget)}
              </span>
            )}
            {requirement.locationLabel && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {requirement.locationLabel}
              </span>
            )}
          </div>

          {(requirement.skillNames.length > 0 ||
            requirement.serviceNames.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {requirement.skillNames.map((name) => (
                <Badge key={`skill-${name}`} variant="secondary">
                  {name}
                </Badge>
              ))}
              {requirement.serviceNames.map((name) => (
                <Badge key={`service-${name}`} variant="default">
                  {name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
