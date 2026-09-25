import Link from "next/link";
import { cn } from "@/lib/utils";
import type { DirectoryFilters } from "@/lib/validations/directory";
import { buildProfileTypeUrl } from "@/lib/search-url";

const TABS = [
  { id: "all" as const, label: "All" },
  { id: "individual" as const, label: "Individuals" },
  { id: "company" as const, label: "Companies" },
];

export function ProfileTypeTabs({ current }: { current: DirectoryFilters }) {
  const active = current.type ?? "all";

  return (
    <div
      role="tablist"
      aria-label="Profile type"
      className="flex flex-wrap gap-1 rounded-xl border border-border bg-surface p-1"
    >
      {TABS.map((tab) => {
        const selected = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={buildProfileTypeUrl(current, tab.id)}
            role="tab"
            aria-selected={selected}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              selected
                ? "bg-ink text-ink-foreground"
                : "text-on-surface-variant hover:bg-accent-muted hover:text-on-surface",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
