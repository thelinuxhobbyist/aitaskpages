import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { PublicRequirementSummary } from "@/lib/requirement-utils";
import { formatDateTime } from "@/lib/utils";
import { Building2, MapPin } from "lucide-react";

export function RequirementPreviewCard({
  requirement,
}: {
  requirement: PublicRequirementSummary;
}) {
  return (
    <Link href={`/requirements/${requirement.id}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-md group-hover:border-primary/30">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-secondary group-hover:text-primary">
              {requirement.title}
            </p>
            <time className="shrink-0 text-xs text-muted">
              {formatDateTime(requirement.createdAt)}
            </time>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {requirement.businessTypeLabel}
            </span>
            {requirement.locationLabel && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {requirement.locationLabel}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
