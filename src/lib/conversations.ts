import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { conversations, messages, type MessageRole } from "@/db/schema";

const nowIso = () => new Date().toISOString();

export type ConversationListItem = {
  id: number;
  counterpartyName: string;
  /** Expert profile slug (only set for the client's view). */
  counterpartySlug: string | null;
  companyName: string | null;
  budget: string | null;
  lastMessageBody: string | null;
  lastMessageAt: string;
  unread: boolean;
};

/** Finds the thread for a client/expert pair, creating it on first contact. */
export async function getOrCreateConversation(params: {
  expertId: number;
  clientUserId: number;
  companyName?: string | null;
  budget?: string | null;
}): Promise<number> {
  const db = await getDb();

  const existing = await db.query.conversations.findFirst({
    where: and(
      eq(conversations.expertId, params.expertId),
      eq(conversations.clientUserId, params.clientUserId)
    ),
  });

  if (existing) {
    const patch: { companyName?: string; budget?: string } = {};
    if (!existing.companyName && params.companyName)
      patch.companyName = params.companyName;
    if (!existing.budget && params.budget) patch.budget = params.budget;
    if (Object.keys(patch).length > 0) {
      await db
        .update(conversations)
        .set(patch)
        .where(eq(conversations.id, existing.id));
    }
    return existing.id;
  }

  const ts = nowIso();
  const [row] = await db
    .insert(conversations)
    .values({
      expertId: params.expertId,
      clientUserId: params.clientUserId,
      companyName: params.companyName ?? null,
      budget: params.budget ?? null,
      createdAt: ts,
      lastMessageAt: ts,
    })
    .returning({ id: conversations.id });

  return row.id;
}

/** Appends a message and bumps the thread; the sender's side is marked read. */
export async function addMessage(params: {
  conversationId: number;
  senderRole: MessageRole;
  body: string;
}) {
  const db = await getDb();
  const ts = nowIso();

  await db.insert(messages).values({
    conversationId: params.conversationId,
    senderRole: params.senderRole,
    body: params.body,
    createdAt: ts,
  });

  await db
    .update(conversations)
    .set({
      lastMessageAt: ts,
      ...(params.senderRole === "client"
        ? { clientLastReadAt: ts }
        : { expertLastReadAt: ts }),
    })
    .where(eq(conversations.id, params.conversationId));
}

/** Marks a thread read for one side (called when they open it). */
export async function markConversationRead(
  conversationId: number,
  role: MessageRole
) {
  const db = await getDb();
  await db
    .update(conversations)
    .set(
      role === "client"
        ? { clientLastReadAt: nowIso() }
        : { expertLastReadAt: nowIso() }
    )
    .where(eq(conversations.id, conversationId));
}

/** Conversations where the user is the client ("My Conversations"). */
export async function getClientConversations(
  clientUserId: number
): Promise<ConversationListItem[]> {
  const db = await getDb();
  const rows = await db.query.conversations.findMany({
    where: eq(conversations.clientUserId, clientUserId),
    orderBy: (c, { desc }) => [desc(c.lastMessageAt)],
    with: {
      expert: { columns: { fullName: true, slug: true } },
      messages: { orderBy: (m, { desc }) => [desc(m.createdAt)], limit: 1 },
    },
  });

  return rows.map((c) => {
    const last = c.messages[0];
    return {
      id: c.id,
      counterpartyName: c.expert?.fullName ?? "Expert",
      counterpartySlug: c.expert?.slug ?? null,
      companyName: c.companyName,
      budget: c.budget,
      lastMessageBody: last?.body ?? null,
      lastMessageAt: c.lastMessageAt,
      unread:
        !!last &&
        last.senderRole === "expert" &&
        (!c.clientLastReadAt || last.createdAt > c.clientLastReadAt),
    };
  });
}

/** Conversations where the user is the expert ("Client Conversations"). */
export async function getExpertConversations(
  expertId: number
): Promise<ConversationListItem[]> {
  const db = await getDb();
  const rows = await db.query.conversations.findMany({
    where: eq(conversations.expertId, expertId),
    orderBy: (c, { desc }) => [desc(c.lastMessageAt)],
    with: {
      client: { columns: { name: true, email: true } },
      messages: { orderBy: (m, { desc }) => [desc(m.createdAt)], limit: 1 },
    },
  });

  return rows.map((c) => {
    const last = c.messages[0];
    return {
      id: c.id,
      counterpartyName: c.client?.name || c.client?.email || "Client",
      counterpartySlug: null,
      companyName: c.companyName,
      budget: c.budget,
      lastMessageBody: last?.body ?? null,
      lastMessageAt: c.lastMessageAt,
      unread:
        !!last &&
        last.senderRole === "client" &&
        (!c.expertLastReadAt || last.createdAt > c.expertLastReadAt),
    };
  });
}

/** Full thread with both parties and all messages (chronological). */
export async function getConversationById(conversationId: number) {
  const db = await getDb();
  return db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
    with: {
      expert: {
        columns: { id: true, fullName: true, slug: true, userId: true },
        with: { user: { columns: { email: true } } },
      },
      client: { columns: { id: true, name: true, email: true } },
      messages: { orderBy: (m, { asc }) => [asc(m.createdAt)] },
    },
  });
}

export async function countClientUnread(clientUserId: number): Promise<number> {
  const list = await getClientConversations(clientUserId);
  return list.filter((c) => c.unread).length;
}

export async function countExpertUnread(expertId: number): Promise<number> {
  const list = await getExpertConversations(expertId);
  return list.filter((c) => c.unread).length;
}
