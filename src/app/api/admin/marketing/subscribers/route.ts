import {
  unauthorizedAdminResponse,
  verifyAdminApiKey,
} from "@/lib/admin-auth";
import { getMarketingSubscribers } from "@/lib/marketing";

export async function GET(request: Request) {
  if (!verifyAdminApiKey(request)) {
    return unauthorizedAdminResponse();
  }

  const subscribers = await getMarketingSubscribers();
  return Response.json({ count: subscribers.length, subscribers });
}
