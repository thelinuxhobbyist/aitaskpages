import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RequirementInterestPanel } from "@/app/requirements/requirement-interest-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatRequirementLocation,
  getBusinessTypeLabel,
  toPublicSummary,
} from "@/lib/requirement-utils";
import { getRequirementById } from "@/lib/requirements";
import { createPageMetadata } from "@/lib/seo";
import { formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { ArrowLeft, Building2, MapPin, Wallet } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const req = await getRequirementById(Number(id));
  if (!req || req.status !== "open") {
    return { title: "Requirement not found" };
  }
  return createPageMetadata({
    title: req.title,
    description: req.description.slice(0, 160),
    path: `/requirements/${req.id}`,
  });
}

export default async function PublicRequirementPage({ params }: Props) {
  const { id } = await params;
  const requirementId = Number(id);
  if (!Number.isInteger(requirementId)) notFound();

  const requirement = await getRequirementById(requirementId);
  if (!requirement || requirement.status !== "open") notFound();

  const summary = toPublicSummary(requirement);
  const locationLabel = formatRequirementLocation(
    requirement.location,
    requirement.remoteOk
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
        <Link href="/requirements">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All requirements
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{requirement.title}</CardTitle>
          <p className="text-sm text-muted">
            Posted {formatDateTime(requirement.createdAt)}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {getBusinessTypeLabel(requirement.businessType)}
            </span>
            {requirement.budget && (
              <span className="flex items-center gap-1.5">
                <Wallet className="h-4 w-4" />
                Est. {formatBudgetGBP(requirement.budget)}
              </span>
            )}
            {locationLabel && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {locationLabel}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-secondary">Description</h2>
            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {requirement.description}
            </p>
          </div>

          {summary.skillNames.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-secondary">
                Skills required
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {summary.skillNames.map((name) => (
                  <Badge key={name} variant="secondary">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {summary.serviceNames.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-secondary">
                Services needed
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {summary.serviceNames.map((name) => (
                  <Badge key={name} variant="default">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <RequirementInterestPanel requirementId={requirementId} />
        </CardContent>
      </Card>
    </div>
  );
}
