import {
  EmailLayout,
  Heading,
  Text,
  heading,
  paragraph,
} from "./layout";

type Props = {
  senderName: string;
  freelancerName: string;
};

export default function SenderConfirmationEmail({
  senderName,
  freelancerName,
}: Props) {
  return (
    <EmailLayout preview={`Your message to ${freelancerName} was sent`}>
      <Heading style={heading}>Message delivered</Heading>
      <Text style={paragraph}>Hi {senderName},</Text>
      <Text style={paragraph}>
        Your enquiry to <strong>{freelancerName}</strong> has been sent
        successfully. They will receive your message by email and can reply to
        you directly.
      </Text>
      <Text style={paragraph}>
        AI Jobs Market is a discovery platform — we do not process payments or
        manage contracts between you and the expert.
      </Text>
    </EmailLayout>
  );
}

export { SenderConfirmationEmail };
