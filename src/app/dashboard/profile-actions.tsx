"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import {
  hideProfileAction,
  restoreProfileAction,
} from "@/app/dashboard/actions";
import { ConfirmAction } from "@/components/confirm-action";
import { Button } from "@/components/ui/button";

type Props = {
  hasProfile: boolean;
  isHidden?: boolean;
};

export function ProfileActions({ hasProfile, isHidden = false }: Props) {
  const router = useRouter();

  if (!hasProfile) {
    return (
      <Button asChild size="sm">
        <Link href="/dashboard?intent=offer">Create your profile</Link>
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild size="sm">
        <Link href="/dashboard#profile-form">
          <Pencil className="h-4 w-4" />
          Edit profile
        </Link>
      </Button>
      {isHidden ? (
        <ConfirmAction
          triggerLabel="Restore profile"
          triggerVariant="outline"
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
      ) : (
        <ConfirmAction
          triggerLabel="Delete profile"
          triggerVariant="outline"
          triggerSize="sm"
          triggerClassName="text-red-600 hover:bg-red-50 hover:text-red-700"
          title="Delete your profile?"
          description="Your profile will be removed from Find AI Expertise and your public page will no longer be visible. You can restore it anytime from your dashboard."
          confirmLabel="Delete profile"
          pendingLabel="Deleting…"
          destructive
          onConfirm={async () => {
            const result = await hideProfileAction();
            if (result.error) return result;
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
