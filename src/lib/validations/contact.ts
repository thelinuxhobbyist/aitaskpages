import { z } from "zod";

export const contactSchema = z.object({
  expertId: z.coerce.number().int().positive(),
  companyName: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000),
  turnstileToken: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/** Full enquiry payload: form fields + sender identity derived from the account. */
export type ContactSubmission = ContactFormData & {
  clientUserId: number;
  senderName: string;
  senderEmail: string;
};

export type ContactFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};
