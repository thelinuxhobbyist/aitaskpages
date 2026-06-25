import { z } from "zod";

export const contactSchema = z.object({
  freelancerId: z.coerce.number().int().positive(),
  senderName: z.string().min(2, "Name is required").max(100),
  senderEmail: z.string().email("Valid email required"),
  companyName: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000),
  turnstileToken: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};
