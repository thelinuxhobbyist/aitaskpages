"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useActionState, useRef, useState } from "react";
import { sendContactEnquiry } from "@/app/freelancers/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContactFormState } from "@/lib/validations/contact";

type Props = {
  freelancerId: number;
  freelancerName: string;
  turnstileSiteKey?: string;
};

const initialState: ContactFormState = {};

export function ContactForm({
  freelancerId,
  freelancerName,
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
          Your enquiry to {freelancerName} has been delivered. Check your inbox
          for a confirmation email — they can reply to you directly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="freelancerId" value={freelancerId} />
      <input type="hidden" name="turnstileToken" value={turnstileToken} />

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="senderName">Your name *</Label>
          <Input id="senderName" name="senderName" required />
          {state.fieldErrors?.senderName && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.senderName[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="senderEmail">Your email *</Label>
          <Input id="senderEmail" name="senderEmail" type="email" required />
          {state.fieldErrors?.senderEmail && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.senderEmail[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company</Label>
          <Input id="companyName" name="companyName" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget (optional)</Label>
          <Input
            id="budget"
            name="budget"
            placeholder="e.g. £5,000–£10,000"
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
          placeholder={`Describe your project and what you're looking for from ${freelancerName}…`}
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
        Your message is sent by email. AI Jobs Market does not process payments
        or contracts — the expert replies directly to you.
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
