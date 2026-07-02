import { CustomTagsField } from "@/app/dashboard/custom-tags-field";
import { MAX_CUSTOM_SERVICES } from "@/lib/profile-utils";

type Props = {
  initialServices?: string[];
};

export function CustomServicesField({ initialServices = [] }: Props) {
  return (
    <CustomTagsField
      name="customServices"
      label="Other services"
      description="Offer something not listed above? Add your own service types here."
      addButtonLabel="Add another service"
      placeholder="e.g. AI audit, workflow automation, model evaluation"
      itemNoun="service"
      maxItems={MAX_CUSTOM_SERVICES}
      initialItems={initialServices}
    />
  );
}
