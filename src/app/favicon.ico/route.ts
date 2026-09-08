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

  // Check R2 for favicon.ico, fallback to favicon-32x32.png
  let object = await env.IMAGES.get("images/logos/favicon.ico");
  let contentType = "image/x-icon";

  if (!object) {
    object = await env.IMAGES.get("images/logos/favicon-32x32.png");
    contentType = "image/png";
  }

  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  // Fast ETag revalidation: 304 if client cache matches R2 object
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === object.httpEtag) {
    return new Response(null, { status: 304 });
  }

  const headers = new Headers();
  headers.set("content-type", contentType);
  headers.set("etag", object.httpEtag);
  headers.set("last-modified", object.uploaded.toUTCString());
  headers.set("cache-control", "public, no-cache, must-revalidate");

  return new Response(object.body as unknown as BodyInit, { headers });
}
