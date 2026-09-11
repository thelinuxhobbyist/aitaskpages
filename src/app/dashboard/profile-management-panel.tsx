"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  hideProfileAction,
  restoreProfileAction,
} from "@/app/dashboard/actions";
import { ConfirmAction } from "@/components/confirm-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExpertProfile } from "@/db/schema";

type Props = {
  profile: ExpertProfile;
};

export function ProfileManagementPanel({ profile }: Props) {
  const router = useRouter();
  const isHidden = profile.status === "hidden";

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-secondary">
            Profile visibility
          </h3>
          <p className="mt-1 text-sm text-muted">
            Control whether your profile appears in Find AI Expertise.
          </p>
        </div>
        <Badge variant={isHidden ? "secondary" : "featured"}>
          {isHidden ? "Hidden" : "Live in directory"}
        </Badge>
      </div>

      {isHidden ? (
        <div className="space-y-3 rounded-lg border border-amber-200/80 bg-amber-50/80 px-4 py-3">
          <p className="text-sm text-amber-950">
            Your profile is hidden. Businesses cannot find you in search, but
            you can still edit it here and restore it when you&apos;re ready.
          </p>
          <ConfirmAction
            triggerLabel="Restore to directory"
            triggerVariant="default"
            triggerSize="sm"
            title="Restore your profile?"
            description="Your profile will appear again in Find AI Expertise and on your public page."
            confirmLabel="Restore profile"
            pendingLabel="Restoring…"
            onConfirm={async () => {
              const result = await restoreProfileAction();
              if (result.error) return result;
              router.refresh();
            }}
          />
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted">
            Remove your listing if you no longer want to receive enquiries.
          </p>
          <ConfirmAction
            triggerLabel="Remove from directory"
            triggerVariant="outline"
            triggerSize="sm"
            triggerClassName="text-red-600 hover:bg-red-50 hover:text-red-700"
            title="Remove your profile from the directory?"
            description="Your profile will be hidden from search and your public page will no longer be visible. You can restore it anytime from your dashboard."
            confirmLabel="Remove profile"
            pendingLabel="Removing…"
            destructive
            onConfirm={async () => {
              const result = await hideProfileAction();
              if (result.error) return result;
              router.refresh();
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
        <Button asChild variant="outline" size="sm">
          <Link href={`/experts/${profile.slug}`}>View public page</Link>
        </Button>
      </div>
    </div>
  );
}
