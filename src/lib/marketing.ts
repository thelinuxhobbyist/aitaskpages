import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  marketingCampaignSends,
  marketingCampaigns,
  users,
} from "@/db/schema";
import { render } from "@react-email/render";
import MarketingEmail from "@/emails/marketing";
import { getMarketingFrom, getResendClient } from "@/lib/email";
import { unsubscribeUrl } from "@/lib/marketing-token";

const BATCH_SIZE = 50;
const BATCH_DELAY_MS = 1100;

export type MarketingSubscriber = {
  id: number;
  email: string;
  name: string | null;
  clerkUserId: string;
  marketingOptIn: boolean;
  unsubscribed: boolean;
  createdAt: string;
};

export async function getMarketingSubscribers(): Promise<MarketingSubscriber[]> {
  const db = await getDb();
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      clerkUserId: users.clerkUserId,
      marketingOptIn: users.marketingOptIn,
      unsubscribed: users.unsubscribed,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(
      and(
        eq(users.marketingOptIn, true),
        eq(users.unsubscribed, false),
        isNull(users.deletedAt)
      )
    );

  return rows;
}

export type CampaignInput = {
  subject: string;
  previewText?: string;
  /** HTML body content (inserted into the marketing email template). */
  bodyHtml: string;
  createdBy?: string;
};

export type CampaignResult = {
  campaignId: number;
  total: number;
  sent: number;
  failed: number;
  failures: { email: string; error: string }[];
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendMarketingCampaign(
  input: CampaignInput
): Promise<CampaignResult> {
  const subscribers = await getMarketingSubscribers();
  const db = await getDb();
  const ts = new Date().toISOString();

  const [campaign] = await db
    .insert(marketingCampaigns)
    .values({
      subject: input.subject,
      previewText: input.previewText ?? null,
      htmlBody: input.bodyHtml,
      sentAt: ts,
      totalRecipients: subscribers.length,
      sentCount: 0,
      failedCount: 0,
      createdBy: input.createdBy ?? null,
    })
    .returning({ id: marketingCampaigns.id });

  const resend = getResendClient();
  const from = getMarketingFrom();
  const failures: { email: string; error: string }[] = [];
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (subscriber) => {
        try {
          const unsubLink = await unsubscribeUrl(subscriber.id);
          const html = await render(
            MarketingEmail({
              preview: input.previewText ?? input.subject,
              recipientName: subscriber.name ?? undefined,
              bodyHtml: input.bodyHtml,
              unsubscribeUrl: unsubLink,
            })
          );

          const { error } = await resend.emails.send({
            from,
            to: subscriber.email,
            subject: input.subject,
            html,
            headers: {
              "List-Unsubscribe": `<${unsubLink}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          });

          if (error) {
            failed += 1;
            failures.push({ email: subscriber.email, error: error.message });
            await db.insert(marketingCampaignSends).values({
              campaignId: campaign.id,
              userId: subscriber.id,
              email: subscriber.email,
              status: "failed",
              errorMessage: error.message,
              sentAt: ts,
            });
            return;
          }

          sent += 1;
          await db.insert(marketingCampaignSends).values({
            campaignId: campaign.id,
            userId: subscriber.id,
            email: subscriber.email,
            status: "sent",
            sentAt: ts,
          });
        } catch (err) {
          failed += 1;
          const message =
            err instanceof Error ? err.message : "Unknown send error";
          failures.push({ email: subscriber.email, error: message });
          await db.insert(marketingCampaignSends).values({
            campaignId: campaign.id,
            userId: subscriber.id,
            email: subscriber.email,
            status: "failed",
            errorMessage: message,
            sentAt: ts,
          });
        }
      })
    );

    if (i + BATCH_SIZE < subscribers.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  await db
    .update(marketingCampaigns)
    .set({ sentCount: sent, failedCount: failed })
    .where(eq(marketingCampaigns.id, campaign.id));

  return {
    campaignId: campaign.id,
    total: subscribers.length,
    sent,
    failed,
    failures,
  };
}

export async function getCampaignById(campaignId: number) {
  const db = await getDb();
  return db.query.marketingCampaigns.findFirst({
    where: eq(marketingCampaigns.id, campaignId),
    with: { sends: true },
  });
}
