import { truncateDescription } from "@/lib/requirement-utils";

/**
 * Split a freeform task description into scannable sections.
 * Prefer blank-line paragraphs; a single block becomes the goal.
 */
export type TaskDescriptionSections = {
  goal: string | null;
  context: string | null;
  additional: string | null;
};

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function structureTaskDescription(
  description: string
): TaskDescriptionSections {
  const paragraphs = splitParagraphs(description.trim());

  if (paragraphs.length >= 3) {
    return {
      goal: paragraphs[0] ?? null,
      context: paragraphs[1] ?? null,
      additional: paragraphs.slice(2).join("\n\n") || null,
    };
  }

  if (paragraphs.length === 2) {
    return {
      goal: paragraphs[0] ?? null,
      context: paragraphs[1] ?? null,
      additional: null,
    };
  }

  return {
    goal: (paragraphs[0] ?? description.trim()) || null,
    context: null,
    additional: null,
  };
}

/** Short header summary: first sentence when possible, else a truncated first paragraph. */
export function taskOpeningSummary(description: string, max = 200): string {
  const first =
    splitParagraphs(description.trim())[0] ?? description.trim();
  const sentence = first.match(/^[^.!?]+[.!?]/);
  const source = sentence?.[0]?.trim() ?? first;
  return truncateDescription(source, max);
}
