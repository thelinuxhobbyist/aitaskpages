import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Background wash class. Defaults to the brand-green hero gradient. */
  washClassName?: string;
};

/** Shared header used by the homepage hero and interior page headers. */
export function PageHero({
  children,
  className,
  innerClassName,
  washClassName = "bg-gradient-hero",
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/60",
        className,
      )}
    >
      <div
        className={cn("pointer-events-none absolute inset-0", washClassName)}
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
