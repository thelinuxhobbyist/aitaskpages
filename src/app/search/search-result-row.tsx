import { ExpertPreviewCard } from "@/components/expert/expert-preview-card";
import type { ProfileWithRelations } from "@/lib/profile-utils";

type Props = {
  profile: ProfileWithRelations;
  /** Kept in sync with the enclosing section heading level. */
  heading?: "h2" | "h3";
};

export function SearchResultRow({ profile, heading = "h3" }: Props) {
  return (
    <ExpertPreviewCard profile={profile} variant="row" heading={heading} />
  );
}
