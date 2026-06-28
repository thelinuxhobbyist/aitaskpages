"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendMessageAction } from "@/app/dashboard/conversations/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { MessageFormState } from "@/lib/validations/message";

const initialState: MessageFormState = {};

export function MessageComposer({
  conversationId,
}: {
  conversationId: number;
}) {
  const [state, formAction, pending] = useActionState(
    sendMessageAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="conversationId" value={conversationId} />

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Textarea
        name="body"
        rows={3}
        required
        placeholder="Write a reply…"
        aria-label="Your message"
      />
      {state.fieldErrors?.body && (
        <p className="text-sm text-red-600">{state.fieldErrors.body[0]}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
