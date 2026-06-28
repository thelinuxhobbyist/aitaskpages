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
  businessName: string;
  requirementTitle: string;
  expertName: string;
  interestedExpertsUrl: string;
};

export default function RequirementInterestEmail({
  businessName,
  requirementTitle,
  expertName,
  interestedExpertsUrl,
}: Props) {
  return (
    <EmailLayout preview={`${expertName} is interested in your requirement`}>
      <Heading style={heading}>New expert interest</Heading>
      <Text style={paragraph}>Hi {businessName},</Text>
      <Text style={paragraph}>
        <strong>{expertName}</strong> has expressed interest in your requirement:
      </Text>
      <Text style={paragraph}>
        <strong>{requirementTitle}</strong>
      </Text>
      <Text style={paragraph}>
        Review interested experts and contact the ones you&apos;d like to speak
        with.
      </Text>

      <Button style={button} href={interestedExpertsUrl}>
        View Interested Experts
      </Button>
    </EmailLayout>
  );
}

export { RequirementInterestEmail };
