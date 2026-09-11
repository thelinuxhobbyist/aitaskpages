"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  canonicalCatalogName,
  isStrongCatalogMatch,
  relatedCatalogTerms,
  suggestCatalogTerms,
  type CatalogTerm,
  type KeywordMap,
} from "@/lib/taxonomy-map";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  label: string;
  description: string;
  placeholder: string;
  itemNoun: string;
  catalog: CatalogTerm[];
  keywords: KeywordMap;
  maxItems: number;
  maxLength: number;
  initialItems?: string[];
};

export function TaxonomyTagField({
  name,
  label,
  description,
  placeholder,
  itemNoun,
  catalog,
  keywords,
  maxItems,
  maxLength,
  initialItems = [],
}: Props) {
  const inputId = useId();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<string[]>(initialItems);
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const suggestions = useMemo(
    () => suggestCatalogTerms(draft, catalog, items, keywords),
    [draft, catalog, items, keywords]
  );

  const related = useMemo(
    () => relatedCatalogTerms(items, catalog, keywords),
    [items, catalog, keywords]
  );

  const canAddCustom = useMemo(() => {
    const value = draft.trim();
    if (value.length < 2) return false;
    const key = value.toLowerCase();
    if (items.some((item) => item.toLowerCase() === key)) return false;
    return !suggestions.some(
      (item) => item.name.toLowerCase() === key
    );
  }, [draft, items, suggestions]);

  const customFirst =
    canAddCustom &&
    !(suggestions[0] && isStrongCatalogMatch(draft, suggestions[0]));

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const tryBuildItem = (raw: string, current: string[]): string | null => {
    const canonical = canonicalCatalogName(raw, catalog);
    const value = canonical.trim().replace(/\s+/g, " ");
    if (value.length < 2) {
      setError("Enter at least 2 characters.");
      return null;
    }
    if (value.length > maxLength) {
      setError(`Keep each ${itemNoun} under ${maxLength} characters.`);
      return null;
    }
    if (current.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setError(`You already added that ${itemNoun}.`);
      return null;
    }
    if (current.length >= maxItems) {
      setError(`You can add up to ${maxItems} ${itemNoun}s.`);
      return null;
    }
    return value;
  };

  const addValues = (rawValues: string[]) => {
    let next = items;
    let added = 0;
    for (const raw of rawValues) {
      const value = tryBuildItem(raw, next);
      if (!value) {
        if (added === 0) return;
        break;
      }
      next = [...next, value];
      added += 1;
    }
    if (added === 0) return;
    setItems(next);
    setDraft("");
    setError(null);
    setActiveIndex(0);
    setOpen(true);
  };

  const addValue = (raw: string) => addValues([raw]);

  const addDraftOrSuggestion = () => {
    if (customFirst && activeIndex === 0) {
      addValue(draft);
      return;
    }
    const suggestionIndex = customFirst ? activeIndex - 1 : activeIndex;
    if (suggestions[suggestionIndex]) {
      addValue(suggestions[suggestionIndex].name);
      return;
    }
    if (draft.trim()) addValue(draft);
  };

  const removeItem = (value: string) => {
    setItems((prev) => prev.filter((item) => item !== value));
    setError(null);
    inputRef.current?.focus();
  };

  const optionCount = suggestions.length + (canAddCustom ? 1 : 0);

  return (
    <div ref={rootRef} className="space-y-2">
      <div>
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none text-slate-700"
        >
          {label}
        </label>
        <p className="mt-1 text-xs text-muted">{description}</p>
      </div>

      <div
        className={cn(
          "rounded-lg border border-border bg-card px-2 py-1.5",
          "focus-within:ring-2 focus-within:ring-ring/50"
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-md bg-neutral-100 py-1 pl-2.5 pr-1 text-sm text-neutral-800 ring-1 ring-neutral-200/80"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="rounded p-0.5 text-muted hover:bg-neutral-200 hover:text-secondary"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <input type="hidden" name={name} value={item} />
            </span>
          ))}

          {items.length < maxItems && (
            <input
              ref={inputRef}
              id={inputId}
              value={draft}
              role="combobox"
              aria-expanded={open && optionCount > 0}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={
                open && optionCount > 0
                  ? `${listboxId}-opt-${activeIndex}`
                  : undefined
              }
              onChange={(e) => {
                setDraft(e.target.value);
                setError(null);
                setOpen(true);
                setActiveIndex(0);
              }}
              onFocus={() => setOpen(true)}
              onPaste={(e) => {
                const text = e.clipboardData.getData("text");
                if (!text.includes(",")) return;
                e.preventDefault();
                addValues(text.split(","));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addDraftOrSuggestion();
                  return;
                }
                if (e.key === "Backspace" && !draft && items.length > 0) {
                  removeItem(items[items.length - 1]);
                  return;
                }
                if (e.key === "Escape") {
                  setOpen(false);
                  return;
                }
                if (e.key === "ArrowDown" && optionCount > 0) {
                  e.preventDefault();
                  setOpen(true);
                  setActiveIndex((i) => (i + 1) % optionCount);
                  return;
                }
                if (e.key === "ArrowUp" && optionCount > 0) {
                  e.preventDefault();
                  setOpen(true);
                  setActiveIndex((i) => (i - 1 + optionCount) % optionCount);
                }
              }}
              placeholder={items.length === 0 ? placeholder : "Add another…"}
              maxLength={maxLength}
              autoComplete="off"
              className="min-w-[10rem] flex-1 border-0 bg-transparent py-1 text-[0.9375rem] outline-none placeholder:text-muted"
            />
          )}
        </div>

        {open && optionCount > 0 && items.length < maxItems && (
          <ul
            id={listboxId}
            role="listbox"
            className="mt-1 max-h-56 overflow-auto rounded-md border border-border bg-card py-1 shadow-soft"
          >
            {canAddCustom && customFirst && (
              <li role="option" aria-selected={activeIndex === 0}>
                <button
                  type="button"
                  id={`${listboxId}-opt-0`}
                  className={cn(
                    "flex w-full px-3 py-1.5 text-left text-sm",
                    activeIndex === 0
                      ? "bg-surface-container text-on-surface"
                      : "text-slate-700 hover:bg-surface"
                  )}
                  onMouseEnter={() => setActiveIndex(0)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addValue(draft)}
                >
                  Add “{draft.trim()}”
                </button>
              </li>
            )}
            {suggestions.map((item, index) => {
              const optionIndex = customFirst ? index + 1 : index;
              return (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={optionIndex === activeIndex}
                >
                  <button
                    type="button"
                    id={`${listboxId}-opt-${optionIndex}`}
                    className={cn(
                      "flex w-full px-3 py-1.5 text-left text-sm",
                      optionIndex === activeIndex
                        ? "bg-surface-container text-on-surface"
                        : "text-slate-700 hover:bg-surface"
                    )}
                    onMouseEnter={() => setActiveIndex(optionIndex)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addValue(item.name)}
                  >
                    {item.name}
                  </button>
                </li>
              );
            })}
            {canAddCustom && !customFirst && (
              <li
                role="option"
                aria-selected={activeIndex === suggestions.length}
              >
                <button
                  type="button"
                  id={`${listboxId}-opt-${suggestions.length}`}
                  className={cn(
                    "flex w-full px-3 py-1.5 text-left text-sm",
                    activeIndex === suggestions.length
                      ? "bg-surface-container text-on-surface"
                      : "text-slate-700 hover:bg-surface"
                  )}
                  onMouseEnter={() => setActiveIndex(suggestions.length)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addValue(draft)}
                >
                  Add “{draft.trim()}”
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      {related.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted">Related:</span>
          {related.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => addValue(item.name)}
              className="rounded-md border border-border bg-card px-2 py-0.5 text-xs text-slate-700 hover:bg-surface"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
