"use client";

import { RouteErrorPanel } from "@/components/route-error-panel";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPanel
      title="Couldn't load your dashboard"
      error={error}
      reset={reset}
      backHref="/"
      backLabel="Back to home"
    />
  );
}
