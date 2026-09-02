import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { SITE_LOGO_URL } from "@/lib/site";

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
          <Img
            src={SITE_LOGO_URL}
            alt="AI Jobs Market"
            height={72}
            style={logoImg}
          />
          <Hr style={hr} />
          {children}
          <Hr style={hr} />
          <Text style={footer}>
            AI Jobs Market is an AI expert directory and task marketplace. We
            provide a platform that connects businesses with independent AI
            professionals and allows them to communicate through AI Jobs Market.
          </Text>
          <Text style={footer}>
            AI Jobs Market is not a party to agreements between users and does
            not participate in contracts, project delivery, professional
            services, or payments between clients and experts. Any agreement is
            made directly between the client and the expert.
          </Text>
          <Text style={brand}>
            <strong>AI Jobs Market</strong>
            <br />
            Find AI experts and post AI tasks across the UK.
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

const logoImg = {
  display: "block" as const,
  margin: "0 0 8px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

const footer = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 12px",
};

const brand = {
  color: "#64748b",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "16px 0 0",
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

export const button = {
  backgroundColor: "#6366f1",
  borderRadius: "9999px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: "600" as const,
  padding: "12px 24px",
  textDecoration: "none",
  margin: "8px 0 20px",
};

export const disclaimer = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "16px 0 0",
};
