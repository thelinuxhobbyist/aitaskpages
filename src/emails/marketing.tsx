import { Button, Text } from "@react-email/components";
import { EmailLayout, button, paragraph } from "./layout";

type Props = {
  preview: string;
  recipientName?: string;
  bodyHtml: string;
  unsubscribeUrl: string;
};

export default function MarketingEmail({
  preview,
  recipientName,
  bodyHtml,
  unsubscribeUrl,
}: Props) {
  return (
    <EmailLayout preview={preview}>
      {recipientName && (
        <Text style={paragraph}>Hi {recipientName},</Text>
      )}
      <Text
        style={{ ...paragraph, margin: "0 0 16px" }}
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
      <Button style={button} href={unsubscribeUrl}>
        Unsubscribe
      </Button>
      <Text style={footerNote}>
        You received this email because you opted in to product updates from AI
        Jobs Market.{" "}
        <a href={unsubscribeUrl} style={link}>
          Unsubscribe
        </a>{" "}
        at any time. Transactional emails about your account and messages are
        unaffected.
      </Text>
    </EmailLayout>
  );
}

export { MarketingEmail };

const footerNote = {
  color: "#64748b",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "24px 0 0",
};

const link = {
  color: "#6366f1",
  textDecoration: "underline",
};
