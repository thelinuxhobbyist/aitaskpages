"use client";

import { useState } from "react";
import {
  saveMarketingPreference,
  type MarketingPreferenceState,
} from "@/app/dashboard/account/actions";
import { FormErrorBanner } from "@/components/form-error-banner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFriendlyActionState } from "@/lib/use-friendly-action-state";

type Props = {
  marketingOptIn: boolean;
  unsubscribed: boolean;
};

const initialState: MarketingPreferenceState = {};

export function MarketingPreferenceForm({
  marketingOptIn,
  unsubscribed,
}: Props) {
  const initialChecked = marketingOptIn && !unsubscribed;
  const [optIn, setOptIn] = useState(initialChecked);
  const [state, formAction, pending] = useFriendlyActionState(
    saveMarketingPreference,
    initialState,
    "We couldn't save your preferences. Please try again."
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <FormErrorBanner message={state.error} />}
      {state.success && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Email preferences saved.
        </p>
      )}

      {unsubscribed && (
        <p className="text-sm text-muted">
          You previously unsubscribed from marketing emails. Check the box
          below to opt back in.
        </p>
      )}

      <div className="flex items-start gap-3">
        <Checkbox
          id="marketingOptIn"
          checked={optIn}
          onCheckedChange={(value) => setOptIn(value === true)}
        />
        <input type="hidden" name="marketingOptIn" value={optIn ? "on" : ""} />
        <Label
          htmlFor="marketingOptIn"
          className="cursor-pointer text-sm leading-snug font-normal"
        >
          I&apos;d like to receive product updates and occasional marketing
          emails.
        </Label>
      </div>

      <p className="text-xs text-muted">
        Transactional emails about your account, messages, and enquiries are
        always sent regardless of this setting.
      </p>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save preferences"}
      </Button>
    </form>
  );
}
