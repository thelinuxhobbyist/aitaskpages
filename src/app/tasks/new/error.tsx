"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PostTaskError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-on-surface">
        Couldn&apos;t load Post a Task
      </h1>
      <p className="mt-2 text-muted">
        {error.message || "Something went wrong. Try again in a moment."}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/tasks">Back to tasks</Link>
        </Button>
      </div>
    </div>
  );
}
