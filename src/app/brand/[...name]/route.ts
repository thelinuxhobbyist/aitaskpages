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

const MIME_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  webp: "image/webp",
};

const BRAND_ALIASES: Record<string, string> = {
  "logo.png": "images/logos/AI JobsMarket-01.png",
  "logo-on-dark.png": "images/logos/footer.png",
  "footer.png": "images/logos/footer.png",
  "16x16-01.png": "images/logos/16x16-01.png",
  "32x32-01.png": "images/logos/32x32-01.png",
  "16x16.png": "images/logos/16x16-01.png",
  "32x32.png": "images/logos/32x32-01.png",
  "favicon.ico": "images/logos/favicon.ico",
  "apple-touch-icon.png": "images/logos/apple-touch-icon.png",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string[] }> }
) {
  const { name } = await params;
  const filename = decodeURIComponent(name.join("/"));

  const env = await getEnv();
  if (!env?.IMAGES) {
    return new Response("Storage unavailable", { status: 503 });
  }

  // Check alias map first, otherwise look under images/logos/
  const r2Key = BRAND_ALIASES[filename] || `images/logos/${filename}`;

  let object = await env.IMAGES.get(r2Key);

  // If alias didn't find specific object (e.g. apple-touch-icon not in R2 yet), fall back
  if (!object && filename === "apple-touch-icon.png") {
    object = await env.IMAGES.get("images/logos/32x32-01.png");
  }

  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  // Conditional request check (HTTP 304)
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === object.httpEtag) {
    return new Response(null, { status: 304 });
  }

  const ext = r2Key.split(".").pop()?.toLowerCase() || "";
  const contentType =
    object.httpMetadata?.contentType || MIME_TYPES[ext] || "application/octet-stream";

  const headers = new Headers();
  headers.set("content-type", contentType);
  headers.set("etag", object.httpEtag);
  headers.set("last-modified", object.uploaded.toUTCString());
  // Instruct browsers and edge to always revalidate with the origin so any R2 update reflects immediately
  headers.set("cache-control", "public, no-cache, must-revalidate");

  return new Response(object.body as unknown as BodyInit, { headers });
}
