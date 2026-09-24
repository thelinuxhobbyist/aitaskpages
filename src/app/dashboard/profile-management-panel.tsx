"use client";

import Link from "next/link";
import { ProfileActions } from "@/app/dashboard/profile-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExpertProfile } from "@/db/schema";

type Props = {
  profile: ExpertProfile;
};

export function ProfileManagementPanel({ profile }: Props) {
  const isHidden = profile.status === "hidden";

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-secondary">
            Edit or delete your profile
          </h3>
          <p className="mt-1 text-sm text-muted">
            {isHidden
              ? "This profile is hidden from Find AI Expertise. Edit it here, or restore it when you want it public again."
              : "Edit the form above to update your listing, or delete the profile to remove it from the directory."}
          </p>
        </div>
        <Badge variant={isHidden ? "secondary" : "featured"}>
          {isHidden ? "Hidden" : "Live in directory"}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <ProfileActions hasProfile isHidden={isHidden} />
        <Button asChild variant="outline" size="sm">
          <Link href={`/experts/${profile.slug}`}>View public page</Link>
        </Button>
      </div>
    </div>
  );
}
