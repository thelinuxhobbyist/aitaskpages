import {
  MAX_TASK_SERVICES,
  MAX_TASK_SKILLS,
  normalizeFreeTextTags,
  MAX_SERVICE_TAG_LENGTH,
  MAX_SKILL_TAG_LENGTH,
} from "@/lib/taxonomy-map";

export type FinderTaskDraft = {
  title: string;
  description: string;
  customSkills?: string[];
  customServices?: string[];
  companyName?: string;
  remoteOk?: boolean;
  source?: "ai-software-finder";
  opportunityId?: string;
};

const PLATFORM_COPY_MARKERS = [
  "introduction platform",
  "directory of ai professionals",
  "ai jobs market",
  "we make the introduction",
];

/** True when pre-filled copy is platform/company marketing rather than a task brief. */
export function isPlatformBoilerplateDescription(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (!t) return false;
  const hits = PLATFORM_COPY_MARKERS.filter((marker) => t.includes(marker)).length;
  return hits >= 2 || (hits >= 1 && t.length < 400);
}

export function decodeFinderTaskDraft(encoded: string): FinderTaskDraft | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as FinderTaskDraft;
    if (!parsed?.title || !parsed?.description) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function parseCustomSkillsFromDraft(skills?: string[]): string[] {
  return normalizeFreeTextTags(
    skills ?? [],
    MAX_TASK_SKILLS,
    MAX_SKILL_TAG_LENGTH
  );
}

export function parseCustomServicesFromDraft(services?: string[]): string[] {
  return normalizeFreeTextTags(
    services ?? [],
    MAX_TASK_SERVICES,
    MAX_SERVICE_TAG_LENGTH
  );
}
