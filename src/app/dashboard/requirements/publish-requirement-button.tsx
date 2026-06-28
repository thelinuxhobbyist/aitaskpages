"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { publishRequirementAction } from "@/app/dashboard/requirements/actions";
import { Button } from "@/components/ui/button";

export function PublishRequirementButton({
  requirementId,
}: {
  requirementId: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish() {
    setPending(true);
    setError(null);
    const result = await publishRequirementAction(requirementId);
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
      <Button type="button" disabled={pending} onClick={handlePublish}>
        {pending ? "Publishing…" : "Publish requirement"}
      </Button>
    </div>
  );
}
