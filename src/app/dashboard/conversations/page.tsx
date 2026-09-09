import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import {
  getClientConversations,
  getExpertConversations,
  type ConversationListItem,
} from "@/lib/conversations";
import { formatBudgetGBP, formatDateTime } from "@/lib/utils";
import { Building2, MessageSquare, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Conversations",
};

function ConversationRow({ item }: { item: ConversationListItem }) {
  return (
    <Link href={`/dashboard/conversations/${item.id}`} className="block">
      <Card
        className={
          item.unread
            ? "border-primary/40 bg-primary/[0.03] transition-shadow hover:shadow-md"
            : "transition-shadow hover:shadow-md hover:border-primary/30"
        }
      >
        <CardContent className="space-y-2 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-secondary">
                {item.counterpartyName}
              </p>
              {item.unread && <Badge variant="featured">New</Badge>}
            </div>
            <time className="shrink-0 text-xs text-muted">
              {formatDateTime(item.lastMessageAt)}
            </time>
          </div>

          {(item.companyName || item.budget) && (
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              {item.companyName && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {item.companyName}
                </span>
              )}
              {item.budget && (
                <span className="flex items-center gap-1.5">
                  <Wallet className="h-4 w-4" />
                  Est. {formatBudgetGBP(item.budget)}
                </span>
              )}
            </div>
          )}

          {item.lastMessageBody && (
            <p className="line-clamp-2 text-sm text-slate-600">
              {item.lastMessageBody}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="px-6 py-10 text-center">
        <MessageSquare
          className="mx-auto h-9 w-9 text-muted"
          strokeWidth={1.5}
        />
        <p className="mt-3 text-sm text-muted">{children}</p>
      </CardContent>
    </Card>
  );
}

export default async function ConversationsPage() {
  const user = await requireUser();

  const [clientConvos, expertConvos] = await Promise.all([
    getClientConversations(user.id),
    user.profile
      ? getExpertConversations(user.profile.id)
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-10">
      {user.profile && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-secondary">
              Client Conversations
            </h2>
            <p className="text-sm text-muted">
              Messages from businesses who contacted you.
            </p>
          </div>
          {expertConvos.length === 0 ? (
            <EmptyState>
              When someone contacts you through your profile, the conversation
              will appear here.
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {expertConvos.map((item) => (
                <ConversationRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-secondary">
            My Conversations
          </h2>
          <p className="text-sm text-muted">
            Experts you have contacted on AI Jobs Market.
          </p>
        </div>
        {clientConvos.length === 0 ? (
          <EmptyState>
            You haven&apos;t started any conversations yet.{" "}
            <Button asChild variant="ghost" size="sm" className="ml-1">
              <Link href="/search">Find expertise</Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {clientConvos.map((item) => (
              <ConversationRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
