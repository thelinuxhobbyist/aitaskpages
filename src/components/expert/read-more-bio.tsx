"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const PREVIEW_LENGTH = 320;

export function ReadMoreBio({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncate = text.length > PREVIEW_LENGTH;
  const display = expanded || !needsTruncate ? text : `${text.slice(0, PREVIEW_LENGTH).trimEnd()}…`;

  return (
    <div>
      <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">
        {display}
      </p>
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
