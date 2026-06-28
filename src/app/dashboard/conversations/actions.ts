"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { addMessage, getConversationById } from "@/lib/conversations";
import { isEmailConfigured, sendNewMessageEmail } from "@/lib/email";
import { conversationUrl } from "@/lib/site";
import { messageSchema, type MessageFormState } from "@/lib/validations/message";
import type { MessageRole } from "@/db/schema";

export async function sendMessageAction(
  _prev: MessageFormState,
  formData: FormData
): Promise<MessageFormState> {
  const user = await requireUser();

  const conversationId = Number(formData.get("conversationId"));
  if (!Number.isInteger(conversationId)) {
    return { error: "Invalid conversation." };
  }

  const parsed = messageSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const convo = await getConversationById(conversationId);
  if (!convo) return { error: "Conversation not found." };

  let role: MessageRole | null = null;
  if (convo.clientUserId === user.id) role = "client";
  else if (user.profile && convo.expertId === user.profile.id)
    role = "expert";
  if (!role) return { error: "You don't have access to this conversation." };

  await addMessage({ conversationId, senderRole: role, body: parsed.data.body });

  // Notify the other party — best-effort, never fails the reply.
  if (isEmailConfigured()) {
    const url = conversationUrl(conversationId);
    try {
      if (role === "expert") {
        const to = convo.client?.email;
        if (to) {
          await sendNewMessageEmail({
            to,
            recipientName: convo.client?.name || to,
            otherPartyName: convo.expert?.fullName ?? "the expert",
            conversationUrl: url,
          });
        }
      } else {
        const to = convo.expert?.user?.email;
        if (to) {
          await sendNewMessageEmail({
            to,
            recipientName: convo.expert?.fullName ?? "there",
            otherPartyName: user.name || user.email || "a client",
            conversationUrl: url,
          });
        }
      }
    } catch (err) {
      console.error("Message notification failed:", err);
    }
  }

  revalidatePath(`/dashboard/conversations/${conversationId}`);
  revalidatePath("/dashboard/conversations");
  revalidatePath("/dashboard");
  return { success: true };
}
