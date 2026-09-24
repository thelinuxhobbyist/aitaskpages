"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const PREVIEW_LENGTH = 1400;

export function ReadMoreBio({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncate = text.length > PREVIEW_LENGTH;
  const display =
    expanded || !needsTruncate
      ? text
      : `${text.slice(0, PREVIEW_LENGTH).trimEnd()}…`;
  const paragraphs = display
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="text-base leading-relaxed text-slate-700"
        >
          {paragraph}
        </p>
      ))}
      {needsTruncate && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-3 h-auto px-0 text-primary hover:bg-transparent"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : "Read more"}
        </Button>
      )}
    </div>
  );
}
