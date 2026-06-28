import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getClientRequirements } from "@/lib/requirements";
import { formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { Building2, MapPin, Plus, Users, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "My Requirements | Dashboard | AI Jobs Market",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
  filled: "Filled",
};

export default async function RequirementsPage() {
  const user = await requireUser();
  const requirements = await getClientRequirements(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-secondary">
            My Requirements
          </h2>
          <p className="text-sm text-muted">
            Post AI requirements and review experts who express interest.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/requirements/new">
            <Plus className="mr-2 h-4 w-4" />
            Post requirement
          </Link>
        </Button>
      </div>

      {requirements.length === 0 ? (
        <Card>
          <CardContent className="px-6 py-10 text-center">
            <p className="text-sm text-muted">
              You haven&apos;t posted any requirements yet. Share what you need
              and matching experts will be notified.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/requirements/new">Post your first requirement</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requirements.map((req) => (
            <Link
              key={req.id}
              href={`/dashboard/requirements/${req.id}`}
              className="block"
            >
              <Card className="transition-shadow hover:shadow-md hover:border-primary/30">
                <CardContent className="space-y-2 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-secondary">{req.title}</p>
                      <Badge
                        variant={
                          req.status === "open"
                            ? "featured"
                            : req.status === "draft"
                              ? "secondary"
                              : "secondary"
                        }
                      >
                        {STATUS_LABELS[req.status] ?? req.status}
                      </Badge>
                    </div>
                    <time className="shrink-0 text-xs text-muted">
                      {formatDateTime(req.createdAt)}
                    </time>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      {req.businessTypeLabel}
                      {req.companyName ? ` (${req.companyName})` : ""}
                    </span>
                    {req.budget && (
                      <span className="flex items-center gap-1.5">
                        <Wallet className="h-4 w-4" />
                        Est. {formatBudgetGBP(req.budget)}
                      </span>
                    )}
                    {req.locationLabel && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {req.locationLabel}
                      </span>
                    )}
                    {req.status === "open" && (
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {req.interestCount} interested
                      </span>
                    )}
                  </div>

                  {(req.skillNames.length > 0 || req.serviceNames.length > 0) && (
                    <div className="flex flex-wrap gap-1.5">
                      {[...req.skillNames, ...req.serviceNames].map((name) => (
                        <Badge key={name} variant="secondary">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
