"use client";

import { expressInterestAction } from "@/app/dashboard/opportunities/actions";
import { FormErrorBanner } from "@/components/form-error-banner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFriendlyActionState } from "@/lib/use-friendly-action-state";
import type { InterestFormState } from "@/lib/validations/requirement";

type Props = {
  requirementId: number;
  alreadyInterested: boolean;
  compact?: boolean;
};

const initialState: InterestFormState = {};

export function InterestButton({
  requirementId,
  alreadyInterested,
  compact = false,
}: Props) {
  const [state, formAction, pending] = useFriendlyActionState(
    expressInterestAction,
    initialState,
    "We couldn't submit your interest. Please try again."
  );

  if (alreadyInterested || state.success) {
    return (
      <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Interest sent. The business can review your profile and get in touch.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="requirementId" value={requirementId} />

      {state.error && <FormErrorBanner message={state.error} />}

      <div className="space-y-2">
        <Label htmlFor="message">Optional note</Label>
        <Textarea
          id="message"
          name="message"
          rows={compact ? 2 : 3}
          placeholder="Briefly explain why you're a good fit…"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className={compact ? "w-full" : undefined}
        size={compact ? "lg" : "default"}
      >
        {pending ? "Sending…" : "Show interest"}
      </Button>
    </form>
  );
}
