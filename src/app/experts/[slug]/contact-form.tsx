"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { sendContactEnquiry } from "@/app/experts/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContactFormState } from "@/lib/validations/contact";

type Props = {
  expertId: number;
  expertName: string;
  turnstileSiteKey?: string;
};

const initialState: ContactFormState = {};

export function ContactForm({
  expertId,
  expertName,
  turnstileSiteKey,
}: Props) {
  const [state, formAction, pending] = useActionState(
    sendContactEnquiry,
    initialState
  );
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  if (state.success) {
    return (
      <div className="rounded-lg bg-emerald-50 px-6 py-8 text-center">
        <p className="text-lg font-semibold text-emerald-800">
          Message sent!
        </p>
        <p className="mt-2 text-sm text-emerald-700">
          Your message to {expertName} has been sent. They&apos;ll be
          notified and can reply to you here on AI Task Pages. You can read and
          continue the conversation from your{" "}
          <Link href="/dashboard/conversations" className="font-medium underline">
            dashboard
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="expertId" value={expertId} />
      <input type="hidden" name="turnstileToken" value={turnstileToken} />

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <p className="rounded-lg bg-surface px-4 py-3 text-sm text-muted">
        This starts a conversation with {expertName} on AI Task Pages.
        You&apos;ll both be able to reply and continue the discussion from your
        dashboard.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company</Label>
          <Input id="companyName" name="companyName" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Estimated budget (£)</Label>
          <Input
            id="budget"
            name="budget"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 15000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={`Describe your project and what you're looking for from ${expertName}…`}
        />
        {state.fieldErrors?.message && (
          <p className="text-sm text-red-600">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      {turnstileSiteKey && (
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          options={{ theme: "light" }}
        />
      )}

      <p className="text-xs text-muted">
        Messages are kept on AI Task Pages. We provide the communication
        platform only — we don&apos;t handle contracts, project delivery or
        payments between users.
      </p>

      <Button
        type="submit"
        disabled={pending || (!!turnstileSiteKey && !turnstileToken)}
      >
        {pending ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
