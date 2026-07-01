import Link from "next/link";
import { RequirementCard } from "@/app/tasks/requirement-card";
import type { PublicRequirementSummary } from "@/lib/requirement-utils";

/** Homepage / preview wrapper — same rich card as the tasks directory. */
export function RequirementPreviewCard({
  requirement,
}: {
  requirement: PublicRequirementSummary;
}) {
  return <RequirementCard requirement={requirement} />;
}
