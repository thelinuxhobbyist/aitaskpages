import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { PublicRequirementSummary } from "@/lib/requirement-utils";
import { formatBudgetGBP } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { MapPin, Wallet } from "lucide-react";

/** Responsive grid — blueprint-inspired cards (~380px min). */
export const taskCardGridClassName =
  "grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,380px),1fr))]";

const MAX_VISIBLE_TAGS = 3;

function formatTaskCardDate(value: string): string {
  const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TaskTag({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "more";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.8125rem] font-medium leading-tight transition-colors",
        variant === "default" &&
          "border border-transparent bg-surface-container-high text-on-surface-variant group-hover:bg-[#e6dfd4]",
        variant === "more" &&
          "border border-border bg-transparent text-muted group-hover:border-outline group-hover:text-on-surface-variant"
      )}
    >
      {children}
    </span>
  );
}

export function RequirementCard({
  requirement,
  showInterestStatus,
  hasInterest,
  className,
}: {
  requirement: PublicRequirementSummary;
  showInterestStatus?: boolean;
  hasInterest?: boolean;
  className?: string;
}) {
  const allTags = [...requirement.skillNames, ...requirement.serviceNames];
  const visibleTags = allTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = Math.max(0, allTags.length - MAX_VISIBLE_TAGS);
  const hasMeta = requirement.budget || requirement.locationLabel;

  return (
    <Link
      href={`/tasks/${requirement.id}`}
      className={cn("group block h-full", className)}
    >
      <article
        className={cn(
          "task-card flex h-full flex-col rounded-2xl border border-border bg-surface p-6 text-on-surface",
          "shadow-[0_8px_24px_rgba(74,68,60,0.06)]",
          "transition-[box-shadow,border-color] duration-200",
          "hover:border-outline hover:shadow-[0_10px_28px_rgba(74,68,60,0.08)]"
        )}
      >
        <header className="mb-4 flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            <p
              className="min-w-0 truncate text-base font-bold leading-none tracking-tight text-secondary"
              title={requirement.companyName}
            >
              {requirement.companyName}
            </p>
            {showInterestStatus &&
              (hasInterest ? (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  Interested
                </Badge>
              ) : (
                <Badge variant="featured" className="shrink-0 text-xs">
                  New
                </Badge>
              ))}
          </div>
          <time
            dateTime={requirement.createdAt}
            className="shrink-0 whitespace-nowrap text-[0.8125rem] font-medium text-muted"
          >
            {formatTaskCardDate(requirement.createdAt)}
          </time>
        </header>

        <div className="mb-5">
          <h3
            className={cn(
              "mb-2.5 font-bold leading-snug tracking-tight text-secondary",
              "line-clamp-2 text-[clamp(1.125rem,2.2vw,1.375rem)]",
              "group-hover:text-primary"
            )}
          >
            {requirement.title}
          </h3>
          <p className="line-clamp-2 text-base leading-[1.65] text-muted">
            {requirement.descriptionExcerpt}
          </p>
        </div>

        {hasMeta && (
          <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/80 pt-4">
            {requirement.budget && (
              <div className="flex items-center gap-1.5 text-[0.9375rem] text-on-surface-variant">
                <Wallet
                  className="h-4 w-4 shrink-0 text-muted"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-muted">Est.</span>
                <strong className="font-bold text-secondary">
                  {formatBudgetGBP(requirement.budget)}
                </strong>
              </div>
            )}
            {requirement.locationLabel && (
              <div className="flex items-center gap-1.5 text-[0.9375rem] text-muted">
                <MapPin
                  className="h-4 w-4 shrink-0"
                  strokeWidth={2}
                  aria-hidden
                />
                <span>{requirement.locationLabel}</span>
              </div>
            )}
          </div>
        )}

        {(visibleTags.length > 0 || hiddenCount > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map((name) => (
              <TaskTag key={name}>{name}</TaskTag>
            ))}
            {hiddenCount > 0 && (
              <TaskTag variant="more">+{hiddenCount} more</TaskTag>
            )}
          </div>
        )}
      </article>
    </Link>
  );
}
