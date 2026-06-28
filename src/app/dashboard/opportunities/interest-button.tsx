"use client";

import { useActionState } from "react";
import { expressInterestAction } from "@/app/dashboard/opportunities/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InterestFormState } from "@/lib/validations/requirement";

type Props = {
  requirementId: number;
  alreadyInterested: boolean;
};

const initialState: InterestFormState = {};

export function InterestButton({
  requirementId,
  alreadyInterested,
}: Props) {
  const [state, formAction, pending] = useActionState(
    expressInterestAction,
    initialState
  );

  if (alreadyInterested || state.success) {
    return (
      <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        You&apos;ve expressed interest. The business will be notified and can
        contact you via your profile.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="requirementId" value={requirementId} />

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Optional note</Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Briefly explain why you're a good fit…"
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "I'm interested"}
      </Button>
    </form>
  );
}
