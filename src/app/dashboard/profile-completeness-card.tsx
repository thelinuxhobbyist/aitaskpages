import { CircleCheck, Circle } from "lucide-react";
import { ProfileActions } from "@/app/dashboard/profile-actions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProfileCompletenessItem } from "@/lib/profile-utils";

type Props = {
  hasProfile: boolean;
  isHidden: boolean;
  completeness: number;
  checklist: ProfileCompletenessItem[];
};

export function ProfileCompletenessCard({
  hasProfile,
  isHidden,
  completeness,
  checklist,
}: Props) {
  const doneCount = checklist.filter((item) => item.done).length;
  const total = checklist.length;

  return (
    <Card className="sm:col-span-2 lg:col-span-4">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-base">Profile completeness</CardTitle>
          <CardDescription>
            {!hasProfile
              ? "Create a profile to appear in Find AI Expertise."
              : completeness === 100
                ? "Every section is filled in. You can still edit or delete your profile."
                : `${doneCount} of ${total} sections complete. Finish the rest so clients can find you.`}
          </CardDescription>
        </div>
        {hasProfile && (
          <Badge variant={isHidden ? "secondary" : "featured"}>
            {isHidden ? "Hidden" : "Live in directory"}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-3xl font-bold text-primary">{completeness}%</p>
            {hasProfile && (
              <p className="text-sm text-muted">
                {doneCount} of {total} done
              </p>
            )}
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-surface-container"
            role="progressbar"
            aria-valuenow={completeness}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completeness"
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        {hasProfile && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {checklist.map((item) => (
              <li
                key={item.name}
                className="flex items-start gap-2.5 rounded-lg border border-border/70 px-3 py-2"
              >
                {item.done ? (
                  <CircleCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden
                  />
                ) : (
                  <Circle
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                    aria-hidden
                  />
                )}
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-on-surface">
                    {item.name}
                  </span>
                  <span className="block text-xs text-muted">
                    {item.done ? "Complete" : item.label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted">
            {hasProfile
              ? isHidden
                ? "Edit your details, or restore the profile to put it back in the directory."
                : "Edit your details, or delete the profile to take it out of the directory."
              : "A complete profile includes a photo, headline, bio, skills, and a way to contact you."}
          </p>
          <ProfileActions hasProfile={hasProfile} isHidden={isHidden} />
        </div>
      </CardContent>
    </Card>
  );
}
