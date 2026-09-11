import { getDeployVersion } from "@/lib/deploy-version";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { buildId: await getDeployVersion() },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
