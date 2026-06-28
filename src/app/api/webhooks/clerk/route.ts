import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { upsertUserFromClerk, type ClerkUserPayload } from "@/lib/clerk-sync";
import { processUserDeletion } from "@/lib/user-deletion";
import { syncClerkEnvFromBindings } from "@/lib/clerk-env";
import { getEnvSecret } from "@/lib/env-secrets";

export async function POST(req: NextRequest) {
  syncClerkEnvFromBindings();
  const secret = getEnvSecret("CLERK_WEBHOOK_SIGNING_SECRET");
  if (!secret) {
    console.error("CLERK_WEBHOOK_SIGNING_SECRET is not configured");
    return Response.json({ error: "Webhook not configured" }, { status: 500 });
  }
  process.env.CLERK_WEBHOOK_SIGNING_SECRET = secret;

  let event;
  try {
    event = await verifyWebhook(req, { signingSecret: secret });
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated":
        await upsertUserFromClerk(event.data as ClerkUserPayload);
        break;
      case "user.deleted": {
        const id = (event.data as { id?: string }).id;
        if (id) await processUserDeletion(id);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error(`Clerk webhook handler failed (${event.type}):`, err);
    return Response.json({ error: "Handler failed" }, { status: 500 });
  }

  return Response.json({ received: true });
}
