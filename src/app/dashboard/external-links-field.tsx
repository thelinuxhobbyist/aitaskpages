"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_EXTERNAL_LINKS } from "@/lib/validations/profile";

type DraftLink = {
  id: string;
  url: string;
};

type Props = {
  initialLinks?: string[];
  isCompany?: boolean;
};

function createEmptyDraft(): DraftLink {
  return { id: crypto.randomUUID(), url: "" };
}

export function ExternalLinksField({
  initialLinks = [],
  isCompany = false,
}: Props) {
  const [links, setLinks] = useState<DraftLink[]>(() =>
    initialLinks.length > 0
      ? initialLinks.map((url) => ({ id: crypto.randomUUID(), url }))
      : []
  );

  const payload = links
    .map((link) => link.url.trim())
    .filter(Boolean)
    .join("\n");

  return (
    <div className="space-y-3">
      <div>
        <Label>
          {isCompany ? "Other company links" : "Other profile links"}
        </Label>
        <p className="mt-1 text-xs text-muted">
          {isCompany
            ? `Optional. Add other official company profiles or pages (Clutch, Crunchbase, X, directory listings, etc.). One URL per row — up to ${MAX_EXTERNAL_LINKS}.`
            : `Optional. Add profiles on other sites (Behance, X, personal site, directory listings, etc.). One URL per row — up to ${MAX_EXTERNAL_LINKS}.`}
        </p>
      </div>

      <input type="hidden" name="externalLinks" value={payload} />

      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={link.id} className="flex items-stretch gap-2">
            <Input
              aria-label={`Other profile link ${index + 1}`}
              type="text"
              inputMode="url"
              placeholder="https://…"
              value={link.url}
              onChange={(e) =>
                setLinks((prev) =>
                  prev.map((item) =>
                    item.id === link.id ? { ...item, url: e.target.value } : item
                  )
                )
              }
              className="min-w-0 flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 px-2"
              onClick={() =>
                setLinks((prev) => prev.filter((item) => item.id !== link.id))
              }
              aria-label={`Remove link ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>

      {links.length < MAX_EXTERNAL_LINKS && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => setLinks((prev) => [...prev, createEmptyDraft()])}
        >
          <Plus className="h-4 w-4" />
          {links.length === 0 ? "Add a link" : "Add another link"}
        </Button>
      )}
    </div>
  );
}
