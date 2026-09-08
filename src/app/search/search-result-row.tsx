import { ExpertPreviewCard } from "@/components/expert/expert-preview-card";
import type { ProfileWithRelations } from "@/lib/profile-utils";
import type { DirectoryFilters } from "@/lib/validations/directory";

type Props = {
  profile: ProfileWithRelations;
  filters?: DirectoryFilters;
  skillLabels?: Map<string, string>;
  serviceLabels?: Map<string, string>;
};

export function SearchResultRow({ profile }: Props) {
  return <ExpertPreviewCard profile={profile} variant="row" />;
}
