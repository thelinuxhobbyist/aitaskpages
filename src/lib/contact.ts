import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { expertProfiles } from "@/db/schema";
import { addMessage, getOrCreateConversation } from "@/lib/conversations";
import {
  isEmailConfigured,
  sendNewMessageEmail,
  sendSenderConfirmationEmail,
} from "@/lib/email";
import { conversationUrl } from "@/lib/site";
import { isTurnstileConfigured, verifyTurnstileToken } from "@/lib/turnstile";
import type { ContactSubmission } from "@/lib/validations/contact";

/**
 * Starts (or continues) a signed-in conversation with an expert.
 * Returns the conversation id. Messaging happens on-platform — emails are notifications only.
 */
export async function startConversationEnquiry(
  data: ContactSubmission,
  remoteIp?: string
): Promise<number> {
  if (isTurnstileConfigured()) {
    const valid = await verifyTurnstileToken(
      data.turnstileToken ?? "",
      remoteIp
    );
    if (!valid) {
      throw new Error("CAPTCHA verification failed. Please try again.");
    }
  }

  const db = await getDb();

  const profile = await db.query.expertProfiles.findFirst({
    where: eq(expertProfiles.id, data.expertId),
    with: { user: true },
  });

  if (!profile || !profile.user) {
    throw new Error("Expert not found.");
  }

  if (profile.user.deletedAt) {
    throw new Error("This expert is no longer available.");
  }

  if (profile.status !== "approved") {
    throw new Error("This expert profile is not available for contact.");
  }

  if (profile.userId === data.clientUserId) {
    throw new Error("You cannot send a message to your own profile.");
  }

  const conversationId = await getOrCreateConversation({
    expertId: data.expertId,
    clientUserId: data.clientUserId,
    companyName: data.companyName || null,
    budget: data.budget || null,
  });

  await addMessage({
    conversationId,
    senderRole: "client",
    body: data.message,
  });

  // Email is best-effort: the message is already saved and visible in the
  // expert's dashboard, so a delivery failure must not fail the request.
  if (isEmailConfigured()) {
    const url = conversationUrl(conversationId);
    try {
      await Promise.all([
        sendNewMessageEmail({
          to: profile.user.email,
          recipientName: profile.fullName,
          otherPartyName: data.senderName,
          conversationUrl: url,
        }),
        sendSenderConfirmationEmail({
          to: data.senderEmail,
          senderName: data.senderName,
          expertName: profile.fullName,
          conversationUrl: url,
        }),
      ]);
    } catch (err) {
      console.error("Enquiry email delivery failed:", err);
    }
  }

  return conversationId;
}

/** @deprecated Use startConversationEnquiry */
export const submitContactRequest = startConversationEnquiry;
