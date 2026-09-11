import {
  unauthorizedAdminResponse,
  verifyAdminApiKey,
} from "@/lib/admin-auth";
import { buildUsersExportCsv } from "@/lib/admin-users-export";

export async function GET(request: Request) {
  if (!verifyAdminApiKey(request)) {
    return unauthorizedAdminResponse();
  }

  const url = new URL(request.url);
  const includeDeleted = url.searchParams.get("include_deleted") === "1";

  const csv = await buildUsersExportCsv({ includeDeleted });
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="aitaskpages-users-${date}.csv"`,
      "Cache-Control": "no-store, private",
    },
  });
}
