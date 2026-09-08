import { getCloudflareContext } from "@opennextjs/cloudflare";

async function getEnv() {
  try {
    return getCloudflareContext().env;
  } catch {
    try {
      return (await getCloudflareContext({ async: true })).env;
    } catch {
      return null;
    }
  }
}

export async function GET(request: Request) {
  const env = await getEnv();
  if (!env?.IMAGES) {
    return new Response("Storage unavailable", { status: 503 });
  }

  let object = await env.IMAGES.get("images/logos/favicon-192x192.png");
  if (!object) {
    object = await env.IMAGES.get("images/logos/apple-touch-icon.png");
  }

  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === object.httpEtag) {
    return new Response(null, { status: 304 });
  }

  const headers = new Headers();
  headers.set("content-type", "image/png");
  headers.set("etag", object.httpEtag);
  headers.set("last-modified", object.uploaded.toUTCString());
  headers.set("cache-control", "public, no-cache, must-revalidate");

  return new Response(object.body as unknown as BodyInit, { headers });
}
