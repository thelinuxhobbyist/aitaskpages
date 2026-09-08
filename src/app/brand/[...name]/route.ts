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
  "favicon.ico": "images/logos/favicon.ico",
  "favicon.svg": "images/logos/favicon.svg",
  "AI JobsMarket-512x512_favicons.svg": "images/logos/AI JobsMarket-512x512_favicons.svg",
  "16x16-01.png": "images/logos/favicon-16x16.png",
  "32x32-01.png": "images/logos/favicon-32x32.png",
  "16x16.png": "images/logos/favicon-16x16.png",
  "32x32.png": "images/logos/favicon-32x32.png",
  "favicon-16x16.png": "images/logos/favicon-16x16.png",
  "favicon-32x32.png": "images/logos/favicon-32x32.png",
  "favicon-48x48.png": "images/logos/favicon-48x48.png",
  "favicon-96x96.png": "images/logos/favicon-96x96.png",
  "favicon-144x144.png": "images/logos/favicon-144x144.png",
  "favicon-192x192.png": "images/logos/favicon-192x192.png",
  "favicon-512x512.png": "images/logos/favicon-512x512.png",
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

  // If alias didn't find specific object, fall back safely
  if (!object && filename === "apple-touch-icon.png") {
    object = await env.IMAGES.get("images/logos/favicon-192x192.png");
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
