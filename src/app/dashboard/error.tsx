"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-8 text-center">
      <h2 className="text-xl font-bold text-secondary">
        Couldn&apos;t load your dashboard
      </h2>
      <p className="mt-2 text-sm text-muted">
        {error.message || "Something went wrong. Try again in a moment."}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
