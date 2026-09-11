"use client";

import { useRouter } from "next/navigation";
import { deleteRequirementAction } from "@/app/dashboard/requirements/actions";
import { ConfirmAction } from "@/components/confirm-action";

type Props = {
  requirementId: number;
  title: string;
};

export function DeleteRequirementButton({ requirementId, title }: Props) {
  const router = useRouter();

  return (
    <ConfirmAction
      triggerLabel="Delete"
      triggerVariant="ghost"
      triggerSize="sm"
      triggerClassName="text-red-600 hover:bg-red-50 hover:text-red-700"
      title="Delete this task?"
      description={
        <>
          <strong className="font-medium text-secondary">{title}</strong> will
          be permanently removed, including any expert interest recorded against
          it. This cannot be undone.
        </>
      }
      confirmLabel="Delete task"
      pendingLabel="Deleting…"
      destructive
      onConfirm={async () => {
        const result = await deleteRequirementAction(requirementId);
        if (result?.error) return result;
        router.refresh();
      }}
    />
  );
}
