"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Only show skeleton UI if loading lasts longer than this. */
export const SKELETON_DELAY_MS = 200;

type Props = {
  children: ReactNode;
  /** When false, any visible fallback hides immediately. */
  isLoading?: boolean;
  delayMs?: number;
};

/**
 * Defers fallback UI until loading exceeds a short threshold, and hides it
 * as soon as loading finishes. Route/Suspense fallbacks stay mounted only
 * while loading, so `isLoading` defaults to true.
 */
export function DelayedFallback({
  children,
  isLoading = true,
  delayMs = SKELETON_DELAY_MS,
}: Props) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowFallback(false);
      return;
    }

    const timer = window.setTimeout(() => {
      if (isLoading) {
        setShowFallback(true);
      }
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [isLoading, delayMs]);

  if (!isLoading || !showFallback) return null;
  return <>{children}</>;
}
