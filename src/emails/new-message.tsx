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
  recipientName: string;
  otherPartyName: string;
  conversationUrl: string;
};

export default function NewMessageEmail({
  recipientName,
  otherPartyName,
  conversationUrl,
}: Props) {
  return (
    <EmailLayout preview="You have a new message on AI Task Pages">
      <Heading style={heading}>You have a new message</Heading>
      <Text style={paragraph}>Hi {recipientName},</Text>
      <Text style={paragraph}>
        You have received a new message regarding your conversation with{" "}
        <strong>{otherPartyName}</strong>.
      </Text>
      <Text style={paragraph}>
        Log in to your AI Task Pages dashboard to read and reply.
      </Text>

      <Button style={button} href={conversationUrl}>
        View Conversation
      </Button>
    </EmailLayout>
  );
}

export { NewMessageEmail };
