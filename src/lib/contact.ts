import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { contactRequests, freelancerProfiles } from "@/db/schema";
import {
  sendFreelancerEnquiryEmail,
  sendSenderConfirmationEmail,
} from "@/lib/email";
import { verifyTurnstileToken, isTurnstileConfigured } from "@/lib/turnstile";
import type { ContactFormData } from "@/lib/validations/contact";

export async function submitContactRequest(
  data: ContactFormData,
  remoteIp?: string
) {
  if (isTurnstileConfigured()) {
    const valid = await verifyTurnstileToken(
      data.turnstileToken ?? "",
      remoteIp
    );
    if (!valid) {
      throw new Error("CAPTCHA verification failed. Please try again.");
    }
  }

  const db = getDb();

  const profile = await db.query.freelancerProfiles.findFirst({
    where: eq(freelancerProfiles.id, data.freelancerId),
    with: { user: true },
  });

  if (!profile || !profile.user) {
    throw new Error("Expert not found.");
  }

  await db.insert(contactRequests).values({
    freelancerId: data.freelancerId,
    senderName: data.senderName,
    senderEmail: data.senderEmail,
    companyName: data.companyName || null,
    budget: data.budget || null,
    message: data.message,
  });

  await Promise.all([
    sendFreelancerEnquiryEmail({
      to: profile.user.email,
      freelancerName: profile.fullName,
      senderName: data.senderName,
      senderEmail: data.senderEmail,
      companyName: data.companyName,
      budget: data.budget,
      message: data.message,
    }),
    sendSenderConfirmationEmail({
      to: data.senderEmail,
      senderName: data.senderName,
      freelancerName: profile.fullName,
    }),
  ]);
}
