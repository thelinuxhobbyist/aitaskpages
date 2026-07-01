"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
      <span className="shrink-0 font-medium">Sort:</span>
      <select
        value={current}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value === "match") {
            params.delete("sort");
          } else {
            params.set("sort", e.target.value);
          }
          router.push(`/search?${params.toString()}`);
        }}
        className="h-9 rounded-lg border border-border bg-white px-3 text-sm text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
