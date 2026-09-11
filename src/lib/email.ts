import { getCloudflareContext } from "@opennextjs/cloudflare";
import { render } from "@react-email/render";
import { Resend } from "resend";
import NewMessageEmail from "@/emails/new-message";
import NewRequirementMatchEmail from "@/emails/new-requirement-match";
import RequirementInterestEmail from "@/emails/requirement-interest";
import SenderConfirmationEmail from "@/emails/sender-confirmation";
import WelcomeEmail from "@/emails/welcome";

/** Default sender — override via EMAIL_FROM; must be a domain verified in Resend for AI Task Pages. */
const DEFAULT_EMAIL_FROM = "AI Task Pages <noreply@example.com>";

/** Sender address, overridable via the EMAIL_FROM env var / binding. */
export function getEmailFrom(): string {
  try {
    const { env } = getCloudflareContext();
    const from = env.EMAIL_FROM;
    if (typeof from === "string" && from) return from;
  } catch {
    if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;
  }
  return DEFAULT_EMAIL_FROM;
}

function getResend() {
  const { env } = getCloudflareContext();
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

/** Shared Resend client for transactional and marketing sends. */
export function getResendClient() {
  return getResend();
}

const DEFAULT_MARKETING_FROM = "AI Task Pages <hello@example.com>";

/** Marketing sender — falls back to transactional from address. */
export function getMarketingFrom(): string {
  try {
    const { env } = getCloudflareContext();
    const from = env.MARKETING_EMAIL_FROM;
    if (typeof from === "string" && from) return from;
  } catch {
    if (process.env.MARKETING_EMAIL_FROM) return process.env.MARKETING_EMAIL_FROM;
  }
  return getEmailFrom() || DEFAULT_MARKETING_FROM;
}

/** Notifies a conversation participant that they have a new message. */
export async function sendNewMessageEmail(params: {
  to: string;
  recipientName: string;
  otherPartyName: string;
  conversationUrl: string;
}) {
  const html = await render(
    NewMessageEmail({
      recipientName: params.recipientName,
      otherPartyName: params.otherPartyName,
      conversationUrl: params.conversationUrl,
    })
  );

  await getResend().emails.send({
    from: getEmailFrom(),
    to: params.to,
    subject: "You have a new message on AI Jobs Market",
    html,
  });
}

export async function sendSenderConfirmationEmail(params: {
  to: string;
  senderName: string;
  expertName: string;
  conversationUrl: string;
}) {
  const html = await render(
    SenderConfirmationEmail({
      senderName: params.senderName,
      expertName: params.expertName,
      conversationUrl: params.conversationUrl,
    })
  );

  await getResend().emails.send({
    from: getEmailFrom(),
    to: params.to,
    subject: `Message sent to ${params.expertName} — AI Jobs Market`,
    html,
  });
}

export async function sendWelcomeEmail(params: {
  to: string;
  name?: string;
}) {
  const html = await render(WelcomeEmail({ name: params.name }));

  await getResend().emails.send({
    from: getEmailFrom(),
    to: params.to,
    subject: "Welcome to AI Jobs Market",
    html,
  });
}

/** Returns true if Resend is configured (emails can be sent). */
export function isEmailConfigured(): boolean {
  try {
    const { env } = getCloudflareContext();
    return !!env.RESEND_API_KEY;
  } catch {
    return !!process.env.RESEND_API_KEY;
  }
}

/** Notifies an expert about a new matching requirement. */
export async function sendNewRequirementMatchEmail(params: {
  to: string;
  expertName: string;
  requirementTitle: string;
  companyName: string;
  requirementUrl: string;
}) {
  const html = await render(
    NewRequirementMatchEmail({
      expertName: params.expertName,
      requirementTitle: params.requirementTitle,
      companyName: params.companyName,
      requirementUrl: params.requirementUrl,
    })
  );

  await getResend().emails.send({
    from: getEmailFrom(),
    to: params.to,
    subject: `New AI requirement: ${params.requirementTitle}`,
    html,
  });
}

/** Notifies a business when an expert expresses interest. */
export async function sendRequirementInterestEmail(params: {
  to: string;
  businessName: string;
  requirementTitle: string;
  expertName: string;
  interestedExpertsUrl: string;
}) {
  const html = await render(
    RequirementInterestEmail({
      businessName: params.businessName,
      requirementTitle: params.requirementTitle,
      expertName: params.expertName,
      interestedExpertsUrl: params.interestedExpertsUrl,
    })
  );

  await getResend().emails.send({
    from: getEmailFrom(),
    to: params.to,
    subject: `${params.expertName} is interested in your requirement`,
    html,
  });
}
