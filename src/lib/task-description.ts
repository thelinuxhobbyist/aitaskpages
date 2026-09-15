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

export type TaskRichBlock =
  | { type: "paragraph"; text: string }
  | { type: "subhead"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

const LIST_ITEM_RE = /^(?:[-*•–—]|\d+[.)])\s+/;
const ORDERED_ITEM_RE = /^\d+[.)]\s+/;

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

/** Short header summary: full first paragraph when it fits, else first sentence. */
export function taskOpeningSummary(description: string, max = 200): string {
  const first =
    splitParagraphs(description.trim())[0] ?? description.trim();
  if (first.length <= max) return first;
  const sentence = first.match(/^[^.!?]+[.!?]/);
  const source = sentence?.[0]?.trim() ?? first;
  return truncateDescription(source, max);
}

/**
 * Body copy for the task page: keep the user's words, avoid repeating the dek.
 * First substantial block → challenge; remaining blocks → additional details.
 */
export function taskBodyNarrative(description: string): {
  challenge: string | null;
  additional: string | null;
} {
  const sections = structureTaskDescription(description);
  const opening = taskOpeningSummary(description).trim();
  const goal = sections.goal?.trim() || null;
  const context = sections.context?.trim() || null;
  const extra = sections.additional?.trim() || null;
  const tail =
    [context, extra].filter((part): part is string => Boolean(part)).join("\n\n") ||
    null;

  if (!goal || goal === opening) {
    return { challenge: context, additional: extra };
  }

  return { challenge: goal, additional: tail };
}

function stripListMarker(line: string): string {
  return line.replace(LIST_ITEM_RE, "").trim();
}

function isListLine(line: string): boolean {
  return LIST_ITEM_RE.test(line.trim());
}

function isSubheadLine(line: string, next?: string): boolean {
  const t = line.trim();
  if (!t || t.length > 90 || isListLine(t)) return false;
  if (t.endsWith("?")) return t.length <= 100;
  if (t.endsWith(".") || t.endsWith("!")) return false;
  if (t.includes(". ")) return false;
  if (!next) return t.length <= 42;
  const following = stripListMarker(next);
  return t.length <= 70 && following.length > t.length + 12;
}

function looksLikeWrappedProse(lines: string[]): boolean {
  if (lines.length < 2) return true;
  if (lines.some((line) => isListLine(line) || isSubheadLine(line))) {
    return false;
  }
  const long = lines.filter((line) => line.trim().length > 52).length;
  return long / lines.length >= 0.6;
}

function parseLineGroup(lines: string[]): TaskRichBlock[] {
  const blocks: TaskRichBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!.trim();
    const next = lines[i + 1];

    if (isListLine(line)) {
      const ordered = ORDERED_ITEM_RE.test(line);
      const items: string[] = [];
      while (i < lines.length && isListLine(lines[i]!.trim())) {
        const current = lines[i]!.trim();
        if (ORDERED_ITEM_RE.test(current) !== ordered) break;
        let item = stripListMarker(current);
        i += 1;
        while (
          i < lines.length &&
          lines[i]!.trim() &&
          !isListLine(lines[i]!.trim()) &&
          !isSubheadLine(lines[i]!.trim(), lines[i + 1])
        ) {
          item = `${item} ${lines[i]!.trim()}`;
          i += 1;
        }
        items.push(item);
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    if (isSubheadLine(line, next)) {
      blocks.push({ type: "subhead", text: line });
      i += 1;
      continue;
    }

    const para: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i]!.trim() &&
      !isListLine(lines[i]!.trim()) &&
      !isSubheadLine(lines[i]!.trim(), lines[i + 1])
    ) {
      para.push(lines[i]!.trim());
      i += 1;
    }
    blocks.push({
      type: "paragraph",
      text: looksLikeWrappedProse(para) ? para.join(" ") : para.join("\n"),
    });
  }

  return blocks;
}

/** Turn a freeform description into paragraphs, lists and short subheads. */
export function parseTaskRichText(text: string): TaskRichBlock[] {
  const chunks = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return chunks.flatMap((chunk) => {
    const lines = chunk
      .split("\n")
      .map((line) => line.trimEnd())
      .filter((line) => line.trim().length > 0);
    if (lines.length === 0) return [];
    return parseLineGroup(lines);
  });
}
