import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type LayoutProps = {
  preview: string;
  children: React.ReactNode;
};

export function EmailLayout({ preview, children }: LayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={logo}>AI Jobs Market</Text>
          <Hr style={hr} />
          {children}
          <Hr style={hr} />
          <Text style={footer}>
            AI Jobs Market — UK AI jobs board &amp; expert directory
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f8fafc",
  fontFamily: "Inter, Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px 24px",
  borderRadius: "8px",
  maxWidth: "560px",
};

const logo = {
  color: "#6366f1",
  fontSize: "20px",
  fontWeight: "700" as const,
  margin: "0 0 8px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

const footer = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "20px",
};

export { Heading, Section, Text };

export const heading = {
  color: "#0f172a",
  fontSize: "22px",
  fontWeight: "600" as const,
  margin: "0 0 16px",
};

export const paragraph = {
  color: "#334155",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 12px",
};

export const label = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
};

export const value = {
  color: "#0f172a",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "0 0 16px",
};

export const messageBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "6px",
  padding: "16px",
  border: "1px solid #e2e8f0",
};
