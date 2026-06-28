import { Button } from "@react-email/components";
import {
  EmailLayout,
  Heading,
  Text,
  button,
  heading,
  paragraph,
} from "./layout";

type Props = {
  expertName: string;
  requirementTitle: string;
  businessTypeLabel: string;
  requirementUrl: string;
};

export default function NewRequirementMatchEmail({
  expertName,
  requirementTitle,
  businessTypeLabel,
  requirementUrl,
}: Props) {
  return (
    <EmailLayout preview={`New AI requirement matching your profile: ${requirementTitle}`}>
      <Heading style={heading}>New opportunity for you</Heading>
      <Text style={paragraph}>Hi {expertName},</Text>
      <Text style={paragraph}>
        A new AI requirement matching your profile has been posted:
      </Text>
      <Text style={paragraph}>
        <strong>{requirementTitle}</strong>
        {` — ${businessTypeLabel}`}
      </Text>
      <Text style={paragraph}>
        View the full details and express your interest.
      </Text>

      <Button style={button} href={requirementUrl}>
        View Requirement
      </Button>
    </EmailLayout>
  );
}

export { NewRequirementMatchEmail };
