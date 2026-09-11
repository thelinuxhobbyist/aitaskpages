"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  getUserFacingErrorMessage,
  isStaleClientBundleError,
} from "@/lib/user-facing-errors";
import { reloadOnceForStaleClient } from "@/lib/reload-for-stale-client";

type Props = {
  title: string;
  error: Error & { digest?: string };
  reset: () => void;
  backHref?: string;
  backLabel?: string;
};

export function RouteErrorPanel({
  title,
  error,
  reset,
  backHref = "/",
  backLabel = "Back to home",
}: Props) {
  const staleAction = isStaleClientBundleError(error);
  const message = getUserFacingErrorMessage(error);

  useEffect(() => {
    console.error(error);
    if (staleAction) {
      reloadOnceForStaleClient("route-error");
    }
  }, [error, staleAction]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-on-surface">{title}</h1>
      <p className="mt-2 text-muted">{message}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {staleAction ? (
          <Button type="button" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
        ) : (
          <Button type="button" onClick={reset}>
            Try again
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
