"use server";

import { headers } from "next/headers";
import { getAuthIdentity, getOrCreateUser } from "@/lib/auth";
import { startConversationEnquiry } from "@/lib/contact";
import { contactSchema, type ContactFormState } from "@/lib/validations/contact";

export async function sendContactEnquiry(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Sender identity comes from the signed-in account — never from the form.
  const identity = await getAuthIdentity();
  if (!identity) {
    return { error: "Please sign in to send a message." };
  }
  if (!identity.emailVerified) {
    return {
      error:
        "Please verify your email address before contacting an expert. Open the account menu to verify it.",
    };
  }

  // Ensure the client has a user row so the conversation is tied to them.
  const clientUser = await getOrCreateUser();
  if (!clientUser) {
    return { error: "We couldn't load your account. Please try again." };
  }
  const senderEmail = clientUser.email || identity.email;
  if (!senderEmail) {
    return { error: "We couldn't read your account email. Please try again." };
  }
  const senderName = clientUser.name || identity.name || senderEmail;

  const parsed = contactSchema.safeParse({
    expertId: formData.get("expertId"),
    companyName: formData.get("companyName") ?? "",
    budget: formData.get("budget") ?? "",
    message: formData.get("message"),
    turnstileToken: formData.get("turnstileToken") ?? "",
  });
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  try {
    const headersList = await headers();
    const ip =
      headersList.get("cf-connecting-ip") ??
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      undefined;

    await startConversationEnquiry(
      { ...parsed.data, clientUserId: clientUser.id, senderName, senderEmail },
      ip
    );
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send enquiry.";
    return { error: message };
  }
}
