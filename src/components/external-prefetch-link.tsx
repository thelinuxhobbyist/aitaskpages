"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ComponentProps,
  type MouseEvent,
} from "react";

/** Placeholder until AI Task Pages has its own Software Finder URL. */
const FINDER_HOME = "";

const SPLASH_HTML = `<!DOCTYPE html>
<html lang="en-GB" style="background:#fafbfc;color-scheme:light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#fafbfc">
<meta name="color-scheme" content="light">
<title>AI Software Finder</title>
<style>
  html,body{margin:0;min-height:100%;background:#fafbfc;color:#64748b;font-family:system-ui,-apple-system,sans-serif}
  body{display:flex;align-items:center;justify-content:center}
</style>
</head>
<body>Loading AI Software Finder…</body>
</html>`;

/** Open a new tab with an immediate light splash — avoids the black empty-tab flash. */
export function openExternalWithSplash(url: string) {
  const tab = window.open("", "_blank");
  if (!tab) {
    window.location.assign(url);
    return;
  }

  tab.document.open();
  tab.document.write(SPLASH_HTML);
  tab.document.close();
  tab.opener = null;
  tab.location.replace(url);
}

function warmExternalDocument(url: string) {
  if (typeof document === "undefined") return;

  const prefetchId = `prefetch-${url}`;
  if (!document.getElementById(prefetchId)) {
    const link = document.createElement("link");
    link.id = prefetchId;
    link.rel = "prefetch";
    link.href = url;
    link.as = "document";
    document.head.appendChild(link);
  }

  const prerenderId = "speculationrules-finder";
  if (!document.getElementById(prerenderId)) {
    const script = document.createElement("script");
    script.id = prerenderId;
    script.type = "speculationrules";
    script.textContent = JSON.stringify({
      prerender: [{ source: "list", urls: [url] }],
    });
    document.head.appendChild(script);
  }
}

type Props = ComponentProps<"a"> & {
  prefetchUrl?: string;
  /** When true (default), new-tab clicks show a light splash instead of a black tab. */
  splashOnNewTab?: boolean;
};

export function ExternalPrefetchLink({
  href = FINDER_HOME,
  prefetchUrl = FINDER_HOME,
  splashOnNewTab = true,
  target,
  onClick,
  onMouseEnter,
  onFocus,
  onTouchStart,
  children,
  ...props
}: Props) {
  const warmed = useRef(false);

  const maybeWarm = useCallback(() => {
    if (warmed.current) return;
    warmed.current = true;
    warmExternalDocument(prefetchUrl);
  }, [prefetchUrl]);

  useEffect(() => {
    const schedule =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback.bind(window)
        : (cb: () => void) => window.setTimeout(cb, 800);

    const cancel =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback.bind(window)
        : window.clearTimeout.bind(window);

    const handle = schedule(maybeWarm);
    return () => cancel(handle);
  }, [maybeWarm]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (splashOnNewTab && target === "_blank") {
      event.preventDefault();
      openExternalWithSplash(href);
    }
    onClick?.(event);
  };

  return (
    <a
      href={href}
      target={target}
      onClick={handleClick}
      onMouseEnter={(event) => {
        maybeWarm();
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        maybeWarm();
        onFocus?.(event);
      }}
      onTouchStart={(event) => {
        maybeWarm();
        onTouchStart?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
