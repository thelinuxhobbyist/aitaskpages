"use client";

import { expressInterestAction } from "@/app/dashboard/opportunities/actions";
import { FormErrorBanner } from "@/components/form-error-banner";
import { Button } from "@/components/ui/button";
import { useFriendlyActionState } from "@/lib/use-friendly-action-state";
import type { InterestFormState } from "@/lib/validations/requirement";
import { ArrowRight } from "lucide-react";

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
    "We couldn't send that just now. Please try again."
  );

  if (alreadyInterested || state.success) {
    return (
      <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-900">
        You&apos;ve let them know you can help. They can see your profile and
        connect with you directly.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="requirementId" value={requirementId} />

      {state.error && <FormErrorBanner message={state.error} />}

      <Button
        type="submit"
        disabled={pending}
        className={compact ? "w-full" : undefined}
        size={compact ? "lg" : "default"}
      >
        {pending ? "Sending…" : "I can help"}
        {!pending && <ArrowRight className="h-4 w-4" />}
      </Button>
      {compact ? null : (
        <p className="text-sm leading-relaxed text-muted">
          If this is relevant to your expertise, connect directly with the
          person who posted it. We make the introduction — we don&apos;t manage
          the work.
        </p>
      )}
    </form>
  );
}
