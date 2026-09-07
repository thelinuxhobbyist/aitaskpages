import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getInterestedExperts, getRequirementById } from "@/lib/requirements";
import { formatDateTime } from "@/lib/utils";
import { MapPin } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const req = await getRequirementById(Number(id));
  return {
    title: req ? `Interested experts — ${req.title}` : "Interested experts",
  };
}

export default async function InterestedExpertsPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const requirementId = Number(id);
  if (!Number.isInteger(requirementId)) notFound();

  const requirement = await getRequirementById(requirementId);
  if (!requirement || requirement.clientUserId !== user.id) notFound();

  let experts;
  try {
    experts = await getInterestedExperts(requirementId, user.id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href={`/dashboard/requirements/${requirementId}`}>
            ← Back to requirement
          </Link>
        </Button>
        <h2 className="text-lg font-semibold text-secondary">
          Interested experts
        </h2>
        <p className="text-sm text-muted">
          {experts.length === 0
            ? `No experts have expressed interest in "${requirement.title}" yet.`
            : `${experts.length} expert${experts.length === 1 ? "" : "s"} interested in "${requirement.title}". Contact them via their profile.`}
        </p>
      </div>

      {experts.length === 0 ? (
        <Card>
          <CardContent className="px-6 py-10 text-center text-sm text-muted">
            Matching experts were notified when you published. Check back as
            interest comes in.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {experts.map((expert) => (
            <Card key={expert.interestId}>
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <Avatar
                    src={expert.profileImageUrl}
                    alt={expert.fullName}
                    className="h-14 w-14"
                    textClassName="text-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-secondary">
                          {expert.fullName}
                        </p>
                        {expert.headline && (
                          <p className="mt-0.5 text-sm text-muted">
                            {expert.headline}
                          </p>
                        )}
                      </div>
                      <time className="shrink-0 text-xs text-muted">
                        {formatDateTime(expert.createdAt)}
                      </time>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted">
                      {expert.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {expert.location}
                        </span>
                      )}
                      {expert.hourlyRate != null && (
                        <span>£{expert.hourlyRate}/hr</span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {[...expert.skillNames, ...expert.serviceNames].map(
                        (name) => (
                          <Badge key={name} variant="secondary">
                            {name}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {expert.message && (
                  <p className="rounded-lg bg-surface px-4 py-3 text-sm text-slate-700">
                    {expert.message}
                  </p>
                )}

                <Button asChild>
                  <Link href={`/experts/${expert.slug}`}>View profile & contact</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
