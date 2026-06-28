import { z } from "zod";
import {
  unauthorizedAdminResponse,
  verifyAdminApiKey,
} from "@/lib/admin-auth";
import { getCampaignById, sendMarketingCampaign } from "@/lib/marketing";

const sendSchema = z.object({
  subject: z.string().min(1).max(200),
  previewText: z.string().max(200).optional(),
  bodyHtml: z.string().min(1),
});

export async function POST(request: Request) {
  if (!verifyAdminApiKey(request)) {
    return unauthorizedAdminResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await sendMarketingCampaign(parsed.data);
  const campaign = await getCampaignById(result.campaignId);

  return Response.json({ ...result, campaign });
}
