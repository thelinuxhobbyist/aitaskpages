import { ExpertPreviewCard } from "@/components/expert/expert-preview-card";
import type { ProfileWithRelations } from "@/lib/profile-utils";

export function ExpertCard({ profile }: { profile: ProfileWithRelations }) {
  return <ExpertPreviewCard profile={profile} variant="grid" />;
}
