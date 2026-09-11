"use client";

import { RouteErrorPanel } from "@/components/route-error-panel";

export default function TaskDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPanel
      title="Couldn't load this task"
      error={error}
      reset={reset}
      backHref="/tasks"
      backLabel="All tasks"
    />
  );
}
