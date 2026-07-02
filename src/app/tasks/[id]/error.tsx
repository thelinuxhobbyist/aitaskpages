"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TaskDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-xl font-bold text-secondary">Couldn&apos;t load this task</h1>
      <p className="mt-2 text-sm text-muted">
        {error.message || "Something went wrong loading the task details."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/tasks">All tasks</Link>
        </Button>
      </div>
    </div>
  );
}
