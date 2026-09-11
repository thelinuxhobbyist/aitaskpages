"use client";

import { RouteErrorPanel } from "@/components/route-error-panel";

export default function PostTaskError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPanel
      title="Couldn't post your task"
      error={error}
      reset={reset}
      backHref="/tasks"
      backLabel="Back to tasks"
    />
  );
}
