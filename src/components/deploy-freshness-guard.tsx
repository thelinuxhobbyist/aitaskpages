"use client";

import { useEffect } from "react";
import {
  clearStaleClientReloadFlag,
  reloadOnceForStaleClient,
} from "@/lib/reload-for-stale-client";
import { errorLooksLikeStaleClient } from "@/lib/user-facing-errors";

const POLL_MS = 5 * 60 * 1000;

type Props = {
  buildId: string;
};

function readMetaBuildId(): string | null {
  return (
    document.querySelector('meta[name="build-id"]')?.getAttribute("content") ??
    null
  );
}

async function fetchServerBuildId(): Promise<string | null> {
  try {
    const response = await fetch("/api/version", { cache: "no-store" });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (
      data &&
      typeof data === "object" &&
      "buildId" in data &&
      typeof (data as { buildId: unknown }).buildId === "string"
    ) {
      return (data as { buildId: string }).buildId;
    }
    return null;
  } catch {
    return null;
  }
}

function maybeReloadForNewDeploy(clientBuildId: string, serverBuildId: string) {
  if (clientBuildId === serverBuildId) {
    clearStaleClientReloadFlag();
    return;
  }

  reloadOnceForStaleClient("deploy-version-mismatch");
}

/**
 * Detects when this tab has stale JS after a deploy and reloads once so server
 * actions and chunks match the live worker.
 */
export function DeployFreshnessGuard({ buildId }: Props) {
  useEffect(() => {
    const clientBuildId = readMetaBuildId() ?? buildId;

    const check = async () => {
      const serverBuildId = await fetchServerBuildId();
      if (!serverBuildId) return;
      maybeReloadForNewDeploy(clientBuildId, serverBuildId);
    };

    void check();

    const onFocus = () => void check();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void check();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    const interval = window.setInterval(() => void check(), POLL_MS);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(interval);
    };
  }, [buildId]);

  useEffect(() => {
    const handleMessage = (message: string) => {
      if (errorLooksLikeStaleClient(message)) {
        reloadOnceForStaleClient("runtime-stale-client");
      }
    };

    const onError = (event: ErrorEvent) => {
      handleMessage(event.message ?? String(event.error ?? ""));
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : "";
      if (errorLooksLikeStaleClient(message)) {
        event.preventDefault();
        reloadOnceForStaleClient("promise-stale-client");
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
