"use client";

import { useCallback, useEffect, useRef, type ComponentProps } from "react";

const FINDER_HOME = "https://finder.aijobsmarket.co.uk";

function prefetchDocument(url: string) {
  if (typeof document === "undefined") return;
  const id = `prefetch-${url}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "prefetch";
  link.href = url;
  link.as = "document";
  document.head.appendChild(link);
}

type Props = ComponentProps<"a"> & {
  prefetchUrl?: string;
};

export function ExternalPrefetchLink({
  href = FINDER_HOME,
  prefetchUrl = FINDER_HOME,
  onMouseEnter,
  onFocus,
  onTouchStart,
  children,
  ...props
}: Props) {
  const prefetched = useRef(false);

  const maybePrefetch = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;
    prefetchDocument(prefetchUrl);
  }, [prefetchUrl]);

  useEffect(() => {
    const schedule =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback.bind(window)
        : (cb: () => void) => window.setTimeout(cb, 1200);

    const cancel =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback.bind(window)
        : window.clearTimeout.bind(window);

    const handle = schedule(maybePrefetch);
    return () => cancel(handle);
  }, [maybePrefetch]);

  return (
    <a
      href={href}
      onMouseEnter={(event) => {
        maybePrefetch();
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        maybePrefetch();
        onFocus?.(event);
      }}
      onTouchStart={(event) => {
        maybePrefetch();
        onTouchStart?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
