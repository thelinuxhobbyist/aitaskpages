/**
 * Split a freeform task description into scannable sections.
 * Prefer blank-line paragraphs; fall back to a single overview.
 */
export type TaskDescriptionSections = {
  goal: string | null;
  existing: string | null;
  helpNeeded: string | null;
  /** Used when the text cannot be split meaningfully. */
  overview: string | null;
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
      existing: paragraphs[1] ?? null,
      helpNeeded: paragraphs.slice(2).join("\n\n") || null,
      overview: null,
    };
  }

  if (paragraphs.length === 2) {
    return {
      goal: paragraphs[0] ?? null,
      existing: null,
      helpNeeded: paragraphs[1] ?? null,
      overview: null,
    };
  }

  return {
    goal: null,
    existing: null,
    helpNeeded: null,
    overview: (paragraphs[0] ?? description.trim()) || null,
  };
}
