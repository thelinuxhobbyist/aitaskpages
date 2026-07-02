import { CustomTagsField } from "@/app/dashboard/custom-tags-field";
import { MAX_CUSTOM_SKILLS } from "@/lib/profile-utils";

type Props = {
  initialSkills?: string[];
};

export function CustomSkillsField({ initialSkills = [] }: Props) {
  return (
    <CustomTagsField
      name="customSkills"
      label="Other skills"
      description="New tools and frameworks appear all the time. If yours is not in the list above, add it here."
      addButtonLabel="Add another skill"
      placeholder="e.g. Claude API, n8n, LangGraph"
      itemNoun="skill"
      maxItems={MAX_CUSTOM_SKILLS}
      initialItems={initialSkills}
    />
  );
}
