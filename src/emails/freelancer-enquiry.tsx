import {
  EmailLayout,
  Heading,
  Section,
  Text,
  heading,
  label,
  messageBox,
  paragraph,
  value,
} from "./layout";

type Props = {
  freelancerName: string;
  senderName: string;
  senderEmail: string;
  companyName?: string;
  budget?: string;
  message: string;
};

export default function FreelancerEnquiryEmail({
  freelancerName,
  senderName,
  senderEmail,
  companyName,
  budget,
  message,
}: Props) {
  return (
    <EmailLayout preview={`New enquiry from ${senderName}`}>
      <Heading style={heading}>New enquiry on AI Jobs Market</Heading>
      <Text style={paragraph}>
        Hi {freelancerName}, someone is interested in your AI expertise.
        Reply directly to their email to start the conversation.
      </Text>

      <Section>
        <Text style={label}>From</Text>
        <Text style={value}>
          {senderName} &lt;{senderEmail}&gt;
        </Text>

        {companyName && (
          <>
            <Text style={label}>Company</Text>
            <Text style={value}>{companyName}</Text>
          </>
        )}

        {budget && (
          <>
            <Text style={label}>Budget</Text>
            <Text style={value}>{budget}</Text>
          </>
        )}

        <Text style={label}>Message</Text>
        <Text style={messageBox}>{message}</Text>
      </Section>

      <Text style={paragraph}>
        Reply to <strong>{senderEmail}</strong> to respond. AI Jobs Market does
        not handle payments or contracts — this is a directory only.
      </Text>
    </EmailLayout>
  );
}

export { FreelancerEnquiryEmail };
