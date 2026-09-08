"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "match", label: "Best Match" },
  { value: "recent", label: "Recently Added" },
  { value: "available", label: "Available Now" },
] as const;

export function SearchSortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "match";

  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="shrink-0 font-medium">Sort</span>
      <span className="relative inline-flex">
        <select
          value={current}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value === "match") {
              params.delete("sort");
            } else {
              params.set("sort", e.target.value);
            }
            const qs = params.toString();
            router.push(qs ? `/search?${qs}` : "/search");
          }}
          className="h-9 appearance-none rounded-lg border border-border bg-white py-0 pl-3 pr-9 text-sm leading-none text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
      </span>
    </label>
  );
}
