import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageComposer } from "@/app/dashboard/conversations/message-composer";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import {
  getConversationById,
  markConversationRead,
} from "@/lib/conversations";
import type { MessageRole } from "@/db/schema";
import { cn, formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { ArrowLeft, Building2, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Conversation | Dashboard | AI Jobs Market",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConversationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const conversationId = Number(id);
  if (!Number.isInteger(conversationId)) notFound();

  const user = await requireUser();
  const convo = await getConversationById(conversationId);
  if (!convo) notFound();

  let role: MessageRole | null = null;
  if (convo.clientUserId === user.id) role = "client";
  else if (user.profile && convo.expertId === user.profile.id)
    role = "expert";
  if (!role) notFound();

  await markConversationRead(conversationId, role);

  const counterpartyName =
    role === "client"
      ? convo.expert?.fullName ?? "Expert"
      : convo.client?.name || convo.client?.email || "Client";

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/conversations"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to conversations
      </Link>

      <div>
        <h2 className="text-xl font-semibold text-secondary">
          {counterpartyName}
        </h2>
        {role === "client" && convo.expert?.slug && (
          <Link
            href={`/experts/${convo.expert.slug}`}
            className="text-sm text-primary hover:underline"
          >
            View profile
          </Link>
        )}
        {role === "expert" && (convo.companyName || convo.budget) && (
          <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted">
            {convo.companyName && (
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {convo.companyName}
              </span>
            )}
            {convo.budget && (
              <span className="flex items-center gap-1.5">
                <Wallet className="h-4 w-4" />
                Est. {formatBudgetGBP(convo.budget)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {convo.messages.map((message) => {
          const mine = message.senderRole === role;
          return (
            <div
              key={message.id}
              className={cn("flex", mine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                  mine
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface"
                )}
              >
                <p className="whitespace-pre-wrap">{message.body}</p>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    mine ? "text-on-primary/70" : "text-muted"
                  )}
                >
                  {formatDateTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-4">
          <MessageComposer conversationId={conversationId} />
        </CardContent>
      </Card>

      <p className="text-xs text-muted">
        AI Jobs Market provides this conversation as a communication tool only.
        We are not a party to any agreement — contracts, project delivery and
        payments are arranged directly between the client and the expert.
      </p>
    </div>
  );
}
