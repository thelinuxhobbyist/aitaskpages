"use client";

import { useRouter } from "next/navigation";
import { closeRequirementAction } from "@/app/dashboard/requirements/actions";
import { ConfirmAction } from "@/components/confirm-action";

export function CloseRequirementButton({
  requirementId,
}: {
  requirementId: number;
}) {
  const router = useRouter();

  return (
    <ConfirmAction
      triggerLabel="Close task"
      triggerVariant="outline"
      triggerSize="sm"
      title="Close this task?"
      description="It will be removed from the public task list. You can still view it here, or delete it permanently."
      confirmLabel="Close task"
      pendingLabel="Closing…"
      onConfirm={async () => {
        const result = await closeRequirementAction(requirementId);
        if (result.error) return result;
        router.refresh();
      }}
    />
  );
}
