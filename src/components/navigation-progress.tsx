"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_HINT_DELAY_MS = 100;

/**
 * Thin top bar during client navigations. Header/footer stay visible; this
 * gives immediate feedback without replacing the whole page with a skeleton.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor?.href || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      let nextUrl: URL;
      try {
        nextUrl = new URL(anchor.href);
      } catch {
        return;
      }

      if (nextUrl.origin !== window.location.origin) return;

      const nextPath = `${nextUrl.pathname}${nextUrl.search}`;
      const currentPath = `${window.location.pathname}${window.location.search}`;
      if (nextPath === currentPath) return;

      window.setTimeout(() => {
        setVisible(true);
      }, NAV_HINT_DELAY_MS);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-transparent"
      aria-hidden
    >
      <div className="h-full w-1/3 animate-[navigation-progress_1.1s_ease-in-out_infinite] rounded-full bg-primary" />
    </div>
  );
}
