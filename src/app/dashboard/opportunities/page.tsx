import Link from "next/link";
import type { Metadata } from "next";
import { RequirementCard, taskCardGridClassName } from "@/app/tasks/requirement-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getMatchingOpportunities } from "@/lib/requirements";
import { Briefcase, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Opportunities",
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
          <Link href="/tasks" className="font-medium text-primary hover:underline">
            Browse all tasks
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
        <div className={taskCardGridClassName}>
          {newOpportunities.length > 0 && (
            <p className="col-span-full flex items-center gap-2 text-sm font-medium text-secondary">
              <Sparkles className="h-4 w-4 text-primary" />
              {newOpportunities.length} new opportunit
              {newOpportunities.length === 1 ? "y" : "ies"} matched to your profile
            </p>
          )}
          {opportunities.map((opp) => (
            <RequirementCard
              key={opp.id}
              requirement={opp}
              showInterestStatus
              hasInterest={opp.hasInterest}
            />
          ))}
        </div>
      )}
    </div>
  );
}
