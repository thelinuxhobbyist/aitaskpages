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
  outcome: string;
  industry: string;
  role: string;
  technologies: string;
  imageUrl: string;
};

type Props = {
  initialExamples?: WorkExample[];
  isCompany?: boolean;
};

function createEmptyDraft(): DraftExample {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    url: "",
    outcome: "",
    industry: "",
    role: "",
    technologies: "",
    imageUrl: "",
  };
}

function toDrafts(examples: WorkExample[]): DraftExample[] {
  return examples.map((example) => ({
    id: crypto.randomUUID(),
    title: example.title,
    description: example.description ?? "",
    url: example.url ?? "",
    outcome: example.outcome ?? "",
    industry: example.industry ?? "",
    role: example.role ?? "",
    technologies: example.technologies?.join(", ") ?? "",
    imageUrl: example.imageUrl ?? "",
  }));
}

export function WorkExamplesField({
  initialExamples = [],
  isCompany = false,
}: Props) {
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
      url: example.url.trim() || undefined,
      outcome: example.outcome.trim() || undefined,
      industry: example.industry.trim() || undefined,
      role: example.role.trim() || undefined,
      technologies: example.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      imageUrl: example.imageUrl.trim() || undefined,
    }))
    .filter(
      (example) =>
        example.title || example.url || example.description || example.outcome
    );

  return (
    <fieldset className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div>
        <legend className="text-sm font-medium text-slate-700">
          Examples of work
        </legend>
        <p className="mt-1 text-xs text-muted">
          {isCompany
            ? "Describe relevant projects in plain language: what the client needed, what you built, and what changed. Add a link, industry, your role, and the technologies where you have them. We don’t host files — use a link for any screenshot or write-up."
            : "Describe relevant projects in plain language: what the client needed, what you built, and what changed. Add a link, industry, your role, and the technologies where you have them. We don’t host files — use a link for any screenshot or write-up."}
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
              What you did
            </Label>
            <Textarea
              id={`work-description-${example.id}`}
              rows={4}
              value={example.description}
              onChange={(e) =>
                updateExample(example.id, "description", e.target.value)
              }
              placeholder="Explain the problem and what was built, as you would to a prospective client."
              maxLength={800}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`work-outcome-${example.id}`}>Outcome</Label>
            <Textarea
              id={`work-outcome-${example.id}`}
              rows={2}
              value={example.outcome}
              onChange={(e) =>
                updateExample(example.id, "outcome", e.target.value)
              }
              placeholder="What changed for the client, if you can say."
              maxLength={400}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`work-industry-${example.id}`}>Industry</Label>
              <Input
                id={`work-industry-${example.id}`}
                value={example.industry}
                maxLength={80}
                onChange={(e) =>
                  updateExample(example.id, "industry", e.target.value)
                }
                placeholder="e.g. Dental"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`work-role-${example.id}`}>Your role</Label>
              <Input
                id={`work-role-${example.id}`}
                value={example.role}
                maxLength={80}
                onChange={(e) =>
                  updateExample(example.id, "role", e.target.value)
                }
                placeholder="e.g. Lead consultant"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`work-tech-${example.id}`}>Technologies</Label>
            <Input
              id={`work-tech-${example.id}`}
              value={example.technologies}
              onChange={(e) =>
                updateExample(example.id, "technologies", e.target.value)
              }
              placeholder="Comma-separated, e.g. Twilio, CRM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`work-url-${example.id}`}>Link to this work</Label>
            <Input
              id={`work-url-${example.id}`}
              type="text"
              inputMode="url"
              value={example.url}
              onChange={(e) => updateExample(example.id, "url", e.target.value)}
              placeholder="https://… case study, demo, or article"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`work-image-${example.id}`}>
              Screenshot or image link
            </Label>
            <Input
              id={`work-image-${example.id}`}
              type="text"
              inputMode="url"
              value={example.imageUrl}
              onChange={(e) =>
                updateExample(example.id, "imageUrl", e.target.value)
              }
              placeholder="https://… image URL, if you have one"
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
