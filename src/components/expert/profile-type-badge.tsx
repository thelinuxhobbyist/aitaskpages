import { cn } from "@/lib/utils";

export function ProfileTypeBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center rounded-full bg-accent-muted px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-on-surface",
        className
      )}
    >
      {label}
    </span>
  );
}
