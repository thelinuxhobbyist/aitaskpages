"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  name: string;
  label: string;
  description: string;
  addButtonLabel: string;
  placeholder: string;
  itemNoun: string;
  maxItems: number;
  initialItems?: string[];
};

export function CustomTagsField({
  name,
  label,
  description,
  addButtonLabel,
  placeholder,
  itemNoun,
  maxItems,
  initialItems = [],
}: Props) {
  const [items, setItems] = useState<string[]>(initialItems);
  const [draft, setDraft] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = () => {
    const value = draft.trim().replace(/\s+/g, " ");
    if (value.length < 2) {
      setError("Enter at least 2 characters.");
      return;
    }
    if (value.length > 50) {
      setError(`Keep each ${itemNoun} under 50 characters.`);
      return;
    }
    if (items.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setError(`You already added that ${itemNoun}.`);
      setDraft("");
      return;
    }
    if (items.length >= maxItems) {
      setError(`You can add up to ${maxItems} custom ${itemNoun}s.`);
      return;
    }
    setItems((prev) => [...prev, value]);
    setDraft("");
    setError(null);
    setShowInput(false);
  };

  const removeItem = (value: string) => {
    setItems((prev) => prev.filter((item) => item !== value));
    setError(null);
  };

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-border bg-accent-muted/50 p-4">
      <div>
        <p className="text-sm font-medium text-secondary">{label}</p>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
        </div>
      )}

      {items.length < maxItems &&
        (showInput ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <Input
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem();
                }
              }}
              placeholder={placeholder}
              autoFocus
              maxLength={50}
            />
            <div className="flex shrink-0 gap-2">
              <Button type="button" size="sm" onClick={addItem}>
                Add
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowInput(false);
                  setDraft("");
                  setError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowInput(true)}
          >
            <Plus className="h-4 w-4" />
            {addButtonLabel}
          </Button>
        ))}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
