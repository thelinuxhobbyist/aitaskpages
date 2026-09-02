import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

/** Shared mint/ink wash used by the homepage hero and interior page headers. */
export function PageHero({ children, className, innerClassName }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/60",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-hero"
        aria-hidden
      />
      <div
        className={cn(
          "relative mx-auto max-w-6xl px-5 py-10 md:py-12",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
