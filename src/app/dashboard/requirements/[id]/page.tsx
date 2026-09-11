import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CloseRequirementButton } from "@/app/dashboard/requirements/close-requirement-button";
import { DeleteRequirementButton } from "@/app/dashboard/requirements/delete-requirement-button";
import { PublishRequirementButton } from "@/app/dashboard/requirements/publish-requirement-button";
import { RequirementForm } from "@/app/dashboard/requirements/requirement-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getRequirementById, getRequirementInterestCount } from "@/lib/requirements";
import { getAllServices, getAllSkills } from "@/lib/profiles";
import {
  formatRequirementLocation,
  getRequirementCompanyLabel,
  getRequirementServiceLabels,
  getRequirementSkillLabels,
} from "@/lib/requirement-utils";
import { formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { Building2, ExternalLink, MapPin, Users, Wallet } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const req = await getRequirementById(Number(id));
  return {
    title: req ? `${req.title} | Tasks` : "Task",
  };
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
  filled: "Filled",
};

export default async function RequirementDetailPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const requirementId = Number(id);
  if (!Number.isInteger(requirementId)) notFound();

  const requirement = await getRequirementById(requirementId);
  if (!requirement || requirement.clientUserId !== user.id) notFound();

  const [skills, services, interestCount] = await Promise.all([
    getAllSkills(),
    getAllServices(),
    getRequirementInterestCount(requirementId),
  ]);

  const isEditable =
    requirement.status === "draft" || requirement.status === "open";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-secondary">
              {requirement.title}
            </h2>
            <Badge
              variant={
                requirement.status === "open"
                  ? "featured"
                  : requirement.status === "draft"
                    ? "secondary"
                    : "secondary"
              }
            >
              {STATUS_LABELS[requirement.status]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            Posted {formatDateTime(requirement.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {requirement.status === "open" && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={`/tasks/${requirementId}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Public page
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/dashboard/requirements/${requirementId}/interested`}>
                  <Users className="mr-2 h-4 w-4" />
                  {interestCount} interested
                </Link>
              </Button>
              <CloseRequirementButton requirementId={requirementId} />
            </>
          )}
          {requirement.status === "draft" && (
            <PublishRequirementButton requirementId={requirementId} />
          )}
          <DeleteRequirementButton
            requirementId={requirementId}
            title={requirement.title}
          />
        </div>
      </div>

      {!isEditable && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Task details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {getRequirementCompanyLabel(
                  requirement.companyName,
                  requirement.businessType
                )}
              </span>
              {requirement.budget && (
                <span className="flex items-center gap-1.5">
                  <Wallet className="h-4 w-4" />
                  Est. {formatBudgetGBP(requirement.budget)}
                </span>
              )}
              {formatRequirementLocation(
                requirement.location,
                requirement.remoteOk
              ) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {formatRequirementLocation(
                    requirement.location,
                    requirement.remoteOk
                  )}
                </span>
              )}
            </div>

            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {requirement.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {getRequirementSkillLabels(requirement).map((name) => (
                <Badge key={`skill-${name}`} variant="secondary">
                  {name}
                </Badge>
              ))}
              {getRequirementServiceLabels(requirement).map((name) => (
                <Badge key={`service-${name}`} variant="secondary">
                  {name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isEditable && (
        <Card>
          <CardHeader>
            <CardTitle>
              {requirement.status === "draft" ? "Edit draft" : "Edit task"}
            </CardTitle>
            <CardDescription>
              {requirement.status === "draft"
                ? "Save as draft or publish to notify matching experts."
                : "Update details while the task is open."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RequirementForm
              requirement={requirement}
              skills={skills}
              services={services}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
