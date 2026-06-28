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
  senderName: string;
  expertName: string;
  conversationUrl: string;
};

export default function SenderConfirmationEmail({
  senderName,
  expertName,
  conversationUrl,
}: Props) {
  return (
    <EmailLayout preview={`Your message to ${expertName} was sent`}>
      <Heading style={heading}>Message sent</Heading>
      <Text style={paragraph}>Hi {senderName},</Text>
      <Text style={paragraph}>
        Your message to <strong>{expertName}</strong> has been sent. They
        have been notified and can reply to you here on AI Jobs Market.
      </Text>
      <Text style={paragraph}>
        We&apos;ll email you when they respond. You can read and continue the
        conversation from your dashboard at any time.
      </Text>

      <Button style={button} href={conversationUrl}>
        View Conversation
      </Button>
    </EmailLayout>
  );
}

export { SenderConfirmationEmail };
