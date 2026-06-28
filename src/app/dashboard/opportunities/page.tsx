import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getMatchingOpportunities } from "@/lib/requirements";
import { formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { Briefcase, Building2, MapPin, Sparkles, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Opportunities | Dashboard | AI Jobs Market",
};

export default async function OpportunitiesPage() {
  const user = await requireUser();

  if (!user.profile) {
    return (
      <Card>
        <CardContent className="px-6 py-10 text-center">
          <Briefcase className="mx-auto h-9 w-9 text-muted" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-muted">
            Create your expert profile to see matching opportunities.
          </p>
          <Button asChild className="mt-4" variant="ghost" size="sm">
            <Link href="/dashboard">Set up your profile</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const opportunities = await getMatchingOpportunities(user.profile.id);
  const newOpportunities = opportunities.filter((o) => !o.hasInterest);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-secondary">My Opportunities</h2>
        <p className="text-sm text-muted">
          Requirements matched to your skills and services.{" "}
          <Link href="/requirements" className="font-medium text-primary hover:underline">
            Browse all requirements
          </Link>
        </p>
      </div>

      {opportunities.length === 0 ? (
        <Card>
          <CardContent className="px-6 py-10 text-center">
            <Briefcase className="mx-auto h-9 w-9 text-muted" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-muted">
              No matching opportunities right now. Add skills and services to
              your profile to improve matching.
            </p>
            <Button asChild className="mt-4" variant="ghost" size="sm">
              <Link href="/dashboard">Update profile</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {newOpportunities.length > 0 && (
            <p className="flex items-center gap-2 text-sm font-medium text-secondary">
              <Sparkles className="h-4 w-4 text-primary" />
              {newOpportunities.length} new opportunit
              {newOpportunities.length === 1 ? "y" : "ies"} matched to your profile
            </p>
          )}
          {opportunities.map((opp) => (
            <Link
              key={opp.id}
              href={`/requirements/${opp.id}`}
              className="block"
            >
              <Card
                className={
                  !opp.hasInterest
                    ? "border-primary/40 bg-primary/[0.03] transition-shadow hover:shadow-md"
                    : "transition-shadow hover:shadow-md hover:border-primary/30"
                }
              >
                <CardContent className="space-y-2 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-secondary">{opp.title}</p>
                      {!opp.hasInterest && (
                        <Badge variant="featured">New</Badge>
                      )}
                      {opp.hasInterest && (
                        <Badge variant="secondary">Interested</Badge>
                      )}
                    </div>
                    <time className="shrink-0 text-xs text-muted">
                      {formatDateTime(opp.createdAt)}
                    </time>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      {opp.businessTypeLabel}
                    </span>
                    {opp.budget && (
                      <span className="flex items-center gap-1.5">
                        <Wallet className="h-4 w-4" />
                        Est. {formatBudgetGBP(opp.budget)}
                      </span>
                    )}
                    {opp.locationLabel && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {opp.locationLabel}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[...opp.skillNames, ...opp.serviceNames].map((name) => (
                      <Badge key={name} variant="secondary">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
