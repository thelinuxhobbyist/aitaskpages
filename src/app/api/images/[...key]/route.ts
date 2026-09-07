import { getCloudflareContext } from "@opennextjs/cloudflare";

async function getEnv() {
  try {
    return getCloudflareContext().env;
  } catch {
    return (await getCloudflareContext({ async: true })).env;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const objectKey = key.join("/");

  const env = await getEnv();
  if (!env?.IMAGES) {
    return new Response("Storage unavailable", { status: 503 });
  }

  const object = await env.IMAGES.get(objectKey);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === object.httpEtag) {
    return new Response(null, { status: 304 });
  }

  const headers = new Headers();
  const contentType = object.httpMetadata?.contentType;
  if (contentType) headers.set("content-type", contentType);
  headers.set("etag", object.httpEtag);
  headers.set("last-modified", object.uploaded.toUTCString());

  // Brand assets and logos can be updated in-place on R2, so require revalidation.
  // Content-hashed or timestamped uploads (like avatars/) can remain immutable.
  const isMutable =
    objectKey.startsWith("images/logos/") ||
    objectKey.startsWith("logos/") ||
    objectKey.includes("logo");

  if (isMutable) {
    headers.set("cache-control", "public, no-cache, must-revalidate");
  } else {
    headers.set("cache-control", "public, max-age=31536000, immutable");
  }

  return new Response(object.body as unknown as BodyInit, { headers });
}
