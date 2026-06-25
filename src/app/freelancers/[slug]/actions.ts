"use server";

import { headers } from "next/headers";
import { submitContactRequest } from "@/lib/contact";
import { contactSchema, type ContactFormState } from "@/lib/validations/contact";

export async function sendContactEnquiry(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    freelancerId: formData.get("freelancerId"),
    senderName: formData.get("senderName"),
    senderEmail: formData.get("senderEmail"),
    companyName: formData.get("companyName") ?? "",
    budget: formData.get("budget") ?? "",
    message: formData.get("message"),
    turnstileToken: formData.get("turnstileToken") ?? "",
  };

  const parsed = contactSchema.safeParse(raw);
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

    await submitContactRequest(parsed.data, ip);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send enquiry.";
    return { error: message };
  }
}
