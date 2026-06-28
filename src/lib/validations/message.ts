import { z } from "zod";

export const messageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Message can't be empty")
    .max(5000, "Message is too long"),
});

export type MessageFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};
