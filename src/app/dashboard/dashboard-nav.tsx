"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Profile" },
  { href: "/dashboard/requirements", label: "Requirements" },
  { href: "/dashboard/opportunities", label: "Opportunities" },
  { href: "/dashboard/conversations", label: "Conversations" },
  { href: "/dashboard/account", label: "Account" },
];

export function DashboardNav({
  unreadCount,
  newOpportunityCount = 0,
}: {
  unreadCount: number;
  newOpportunityCount?: number;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border/60">
      {TABS.map((tab) => {
        const active =
          tab.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative -mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              active
                ? "border-ink text-on-surface"
                : "border-transparent text-muted hover:text-on-surface",
            )}
          >
            {tab.label}
            {tab.href === "/dashboard/conversations" && unreadCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-semibold text-ink-foreground">
                {unreadCount}
              </span>
            )}
            {tab.href === "/dashboard/opportunities" &&
              newOpportunityCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-semibold text-ink-foreground">
                  {newOpportunityCount}
                </span>
              )}
          </Link>
        );
      })}
    </nav>
  );
}
