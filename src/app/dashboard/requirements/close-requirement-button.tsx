"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { closeRequirementAction } from "@/app/dashboard/requirements/actions";
import { Button } from "@/components/ui/button";

export function CloseRequirementButton({
  requirementId,
}: {
  requirementId: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClose() {
    setPending(true);
    setError(null);
    const result = await closeRequirementAction(requirementId);
    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={pending}
        onClick={handleClose}
      >
        {pending ? "Closing…" : "Close requirement"}
      </Button>
    </div>
  );
}
