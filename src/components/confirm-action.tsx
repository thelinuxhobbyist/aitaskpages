"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  triggerLabel: string;
  triggerVariant?: "default" | "outline" | "ghost" | "secondary" | "ink";
  triggerSize?: "default" | "sm" | "lg";
  triggerClassName?: string;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  pendingLabel?: string;
  destructive?: boolean;
  onConfirm: () => Promise<{ error?: string } | void>;
};

export function ConfirmAction({
  triggerLabel,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerClassName,
  title,
  description,
  confirmLabel = "Confirm",
  pendingLabel = "Working…",
  destructive = false,
  onConfirm,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    if (pending) return;
    dialogRef.current?.close();
  }

  async function handleConfirm() {
    setPending(true);
    setError(null);
    const result = await onConfirm();
    if (result?.error) {
      setError(result.error);
      setPending(false);
      return;
    }
    dialogRef.current?.close();
    setPending(false);
  }

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        size={triggerSize}
        className={triggerClassName}
        onClick={openDialog}
      >
        {triggerLabel}
      </Button>

      <dialog
        ref={dialogRef}
        className="fixed left-1/2 top-1/2 z-50 w-[min(100vw-2rem,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-0 text-left shadow-lift backdrop:bg-ink/40"
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <form method="dialog" className="p-6" onSubmit={(e) => e.preventDefault()}>
          <h3 className="text-lg font-semibold text-secondary">{title}</h3>
          <div className="mt-2 text-sm text-muted">{description}</div>
          {error && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="default"
              className={destructive ? "bg-red-600 text-white hover:bg-red-700" : undefined}
              disabled={pending}
              onClick={() => void handleConfirm()}
            >
              {pending ? pendingLabel : confirmLabel}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
