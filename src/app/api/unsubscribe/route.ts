import { unsubscribeUser } from "@/lib/clerk-sync";
import { parseUnsubscribeToken } from "@/lib/marketing-token";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return Response.redirect(
      new URL("/unsubscribe?error=missing", req.url).toString()
    );
  }

  const userId = await parseUnsubscribeToken(token);
  if (!userId) {
    return Response.redirect(
      new URL("/unsubscribe?error=invalid", req.url).toString()
    );
  }

  await unsubscribeUser(userId);
  return Response.redirect(
    new URL("/unsubscribe?success=1", req.url).toString()
  );
}

/** RFC 8058 one-click unsubscribe POST support. */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return Response.json({ error: "Missing token" }, { status: 400 });
  }

  const userId = await parseUnsubscribeToken(token);
  if (!userId) {
    return Response.json({ error: "Invalid token" }, { status: 400 });
  }

  await unsubscribeUser(userId);
  return Response.json({ unsubscribed: true });
}
