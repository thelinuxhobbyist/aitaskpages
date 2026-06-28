import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Format a budget value as GBP with thousands separators (e.g. "15000" → "£15,000").
 * Plain numeric input is reformatted; anything else (ranges, free text) is left as-is.
 */
export function formatBudgetGBP(
  value: string | null | undefined
): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const cleaned = trimmed.replace(/[£,\s]/g, "");
  if (/^\d+$/.test(cleaned)) {
    return `£${Number(cleaned).toLocaleString("en-GB")}`;
  }
  return trimmed;
}

/** Formats a stored timestamp (ISO or SQLite "YYYY-MM-DD HH:MM:SS") for display. */
export function formatDateTime(value: string): string {
  const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
