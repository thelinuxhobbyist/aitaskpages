export type FinderTaskDraft = {
  title: string;
  description: string;
  customSkills?: string[];
  companyName?: string;
  remoteOk?: boolean;
  source?: "ai-software-finder";
  opportunityId?: string;
};

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
  return (skills ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 10);
}
