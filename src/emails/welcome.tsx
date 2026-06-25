import {
  EmailLayout,
  Heading,
  Text,
  heading,
  paragraph,
} from "./layout";

type Props = {
  name?: string;
};

export default function WelcomeEmail({ name }: Props) {
  const greeting = name ? `Hi ${name},` : "Hi there,";

  return (
    <EmailLayout preview="Welcome to AI Jobs Market">
      <Heading style={heading}>Welcome to AI Jobs Market</Heading>
      <Text style={paragraph}>{greeting}</Text>
      <Text style={paragraph}>
        Your account is ready. Complete your expert profile in the dashboard to
        appear in the AI Experts directory and start receiving enquiries from
        businesses.
      </Text>
      <Text style={paragraph}>
        Visit your dashboard to add your skills, services, and bio.
      </Text>
    </EmailLayout>
  );
}

export { WelcomeEmail };
