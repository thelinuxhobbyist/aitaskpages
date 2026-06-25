import { getCloudflareContext } from "@opennextjs/cloudflare";
import { render } from "@react-email/render";
import { Resend } from "resend";
import FreelancerEnquiryEmail from "@/emails/freelancer-enquiry";
import SenderConfirmationEmail from "@/emails/sender-confirmation";
import WelcomeEmail from "@/emails/welcome";

export const EMAIL_FROM = "AI Jobs Market <noreply@aijobsmarket.com>";

function getResend() {
  const { env } = getCloudflareContext();
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

export async function sendFreelancerEnquiryEmail(params: {
  to: string;
  freelancerName: string;
  senderName: string;
  senderEmail: string;
  companyName?: string;
  budget?: string;
  message: string;
}) {
  const html = await render(
    FreelancerEnquiryEmail({
      freelancerName: params.freelancerName,
      senderName: params.senderName,
      senderEmail: params.senderEmail,
      companyName: params.companyName,
      budget: params.budget,
      message: params.message,
    })
  );

  await getResend().emails.send({
    from: EMAIL_FROM,
    to: params.to,
    replyTo: params.senderEmail,
    subject: `New enquiry from ${params.senderName} — AI Jobs Market`,
    html,
  });
}

export async function sendSenderConfirmationEmail(params: {
  to: string;
  senderName: string;
  freelancerName: string;
}) {
  const html = await render(
    SenderConfirmationEmail({
      senderName: params.senderName,
      freelancerName: params.freelancerName,
    })
  );

  await getResend().emails.send({
    from: EMAIL_FROM,
    to: params.to,
    subject: `Message sent to ${params.freelancerName} — AI Jobs Market`,
    html,
  });
}

export async function sendWelcomeEmail(params: {
  to: string;
  name?: string;
}) {
  const html = await render(WelcomeEmail({ name: params.name }));

  await getResend().emails.send({
    from: EMAIL_FROM,
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
