"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_WORK_EXAMPLES } from "@/lib/validations/profile";
import type { WorkExample } from "@/lib/profile-utils";

type DraftExample = {
  id: string;
  title: string;
  description: string;
  url: string;
};

type Props = {
  initialExamples?: WorkExample[];
};

function createEmptyDraft(): DraftExample {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    url: "",
  };
}

function toDrafts(examples: WorkExample[]): DraftExample[] {
  return examples.map((example) => ({
    id: crypto.randomUUID(),
    title: example.title,
    description: example.description ?? "",
    url: example.url,
  }));
}

export function WorkExamplesField({ initialExamples = [] }: Props) {
  const [examples, setExamples] = useState<DraftExample[]>(() =>
    toDrafts(initialExamples)
  );

  const updateExample = (
    id: string,
    field: keyof Omit<DraftExample, "id">,
    value: string
  ) => {
    setExamples((prev) =>
      prev.map((example) =>
        example.id === id ? { ...example, [field]: value } : example
      )
    );
  };

  const removeExample = (id: string) => {
    setExamples((prev) => prev.filter((example) => example.id !== id));
  };

  const payload = examples
    .map((example) => ({
      title: example.title.trim(),
      description: example.description.trim() || undefined,
      url: example.url.trim(),
    }))
    .filter((example) => example.title || example.url || example.description);

  return (
    <fieldset className="space-y-4 rounded-xl border border-border bg-surface-container/20 p-4 sm:p-5">
      <div>
        <legend className="text-sm font-medium text-slate-700">
          Examples of work
        </legend>
        <p className="mt-1 text-xs text-muted">
          Optional. Showcase specific projects or deliverables — each with a
          title, short note, and link to the work itself (case study, repo,
          demo, article). This is different from the presence links above
          (LinkedIn, website, etc.). We don’t host files or media.
        </p>
      </div>

      <input
        type="hidden"
        name="workExamples"
        value={JSON.stringify(payload)}
      />

      {examples.map((example, index) => (
        <div
          key={example.id}
          className="space-y-3 rounded-xl border border-border bg-surface p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-secondary">
              Example {index + 1}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeExample(example.id)}
              aria-label={`Remove example ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`work-title-${example.id}`}>Title *</Label>
            <Input
              id={`work-title-${example.id}`}
              value={example.title}
              onChange={(e) =>
                updateExample(example.id, "title", e.target.value)
              }
              placeholder="e.g. AI Customer Support Agent"
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`work-description-${example.id}`}>
              Short description
            </Label>
            <Textarea
              id={`work-description-${example.id}`}
              rows={3}
              value={example.description}
              onChange={(e) =>
                updateExample(example.id, "description", e.target.value)
              }
              placeholder="e.g. Built an AI-powered customer support system using RAG and LLMs."
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`work-url-${example.id}`}>Link to this work *</Label>
            <Input
              id={`work-url-${example.id}`}
              type="text"
              inputMode="url"
              value={example.url}
              onChange={(e) => updateExample(example.id, "url", e.target.value)}
              placeholder="https://github.com/…/repo or case-study URL"
            />
          </div>
        </div>
      ))}

      {examples.length < MAX_WORK_EXAMPLES && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() =>
            setExamples((prev) => [...prev, createEmptyDraft()])
          }
        >
          <Plus className="h-4 w-4" />
          {examples.length === 0 ? "Add an example" : "Add another example"}
        </Button>
      )}
    </fieldset>
  );
}
