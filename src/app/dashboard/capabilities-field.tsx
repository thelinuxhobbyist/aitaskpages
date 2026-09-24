"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_CAPABILITIES } from "@/lib/validations/profile";
import type { Capability } from "@/lib/profile-utils";

type Draft = {
  id: string;
  title: string;
  description: string;
};

type Props = {
  initialCapabilities?: Capability[];
};

function emptyDraft(): Draft {
  return { id: crypto.randomUUID(), title: "", description: "" };
}

export function CapabilitiesField({ initialCapabilities = [] }: Props) {
  const [items, setItems] = useState<Draft[]>(() =>
    initialCapabilities.map((item) => ({
      id: crypto.randomUUID(),
      title: item.title,
      description: item.description,
    }))
  );

  const payload = items
    .map((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
    }))
    .filter((item) => item.title || item.description);

  return (
    <fieldset className="space-y-4">
      <div>
        <legend className="text-sm font-medium text-slate-700">
          What you help businesses do
        </legend>
        <p className="mt-1 text-xs text-muted">
          Write 3–5 short descriptions of the work you take on. These are what
          a client reads. The tags below are for search.
        </p>
      </div>

      <input type="hidden" name="capabilities" value={JSON.stringify(payload)} />

      {items.map((item, index) => (
        <div
          key={item.id}
          className="space-y-3 rounded-xl border border-border bg-surface p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-secondary">
              Capability {index + 1}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setItems((prev) => prev.filter((row) => row.id !== item.id))
              }
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`cap-title-${item.id}`}>Title</Label>
            <Input
              id={`cap-title-${item.id}`}
              value={item.title}
              maxLength={80}
              placeholder="e.g. AI automation"
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((row) =>
                    row.id === item.id
                      ? { ...row, title: event.target.value }
                      : row
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`cap-body-${item.id}`}>Description</Label>
            <Textarea
              id={`cap-body-${item.id}`}
              rows={3}
              maxLength={500}
              value={item.description}
              placeholder="Explain the kind of problem this solves, in plain language."
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((row) =>
                    row.id === item.id
                      ? { ...row, description: event.target.value }
                      : row
                  )
                )
              }
            />
          </div>
        </div>
      ))}

      {items.length < MAX_CAPABILITIES && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setItems((prev) => [...prev, emptyDraft()])}
        >
          <Plus className="h-4 w-4" />
          {items.length === 0 ? "Add a capability" : "Add another"}
        </Button>
      )}
    </fieldset>
  );
}
