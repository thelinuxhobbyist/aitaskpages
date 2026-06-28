import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAuthIdentity } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function getEnv() {
  try {
    return getCloudflareContext().env;
  } catch {
    return (await getCloudflareContext({ async: true })).env;
  }
}

/**
 * Resolves an R2 object key from a stored image URL, but only if it belongs to
 * the given user (`avatars/{userId}/…`). Returns null for external/foreign URLs
 * so we never delete objects we don't own.
 */
function ownedKeyFromUrl(
  rawUrl: string | null,
  userId: string,
  publicBase: string
): string | null {
  if (!rawUrl) return null;

  let key: string | null = null;
  const apiPrefix = "/api/images/";

  if (rawUrl.startsWith(apiPrefix)) {
    key = rawUrl.slice(apiPrefix.length);
  } else if (publicBase && rawUrl.startsWith(publicBase)) {
    key = rawUrl.slice(publicBase.length).replace(/^\/+/, "");
  } else {
    try {
      const parsed = new URL(rawUrl);
      const baseHost = publicBase ? new URL(publicBase).host : null;
      if (baseHost && parsed.host === baseHost) {
        key = parsed.pathname.replace(/^\/+/, "");
      }
    } catch {
      // Not an absolute URL — ignore.
    }
  }

  if (!key) return null;
  return key.startsWith(`avatars/${userId}/`) ? key : null;
}

export async function POST(request: Request) {
  const identity = await getAuthIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Please sign in to upload." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const ext = ALLOWED_EXTENSIONS[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported image type. Use JPEG, PNG, WebP or GIF." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image too large. Maximum size is 5MB." },
      { status: 413 }
    );
  }

  const env = await getEnv();
  const key = `avatars/${identity.userId}/${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();

  await env.IMAGES.put(key, bytes, {
    httpMetadata: { contentType: file.type },
  });

  const publicBase =
    typeof env.IMAGES_BASE_URL === "string"
      ? env.IMAGES_BASE_URL.replace(/\/+$/, "")
      : "";
  const url = publicBase ? `${publicBase}/${key}` : `/api/images/${key}`;

  // Delete the photo being replaced (only if it's this user's own upload).
  const previousUrl = form.get("previousUrl");
  const oldKey = ownedKeyFromUrl(
    typeof previousUrl === "string" ? previousUrl : null,
    identity.userId,
    publicBase
  );
  if (oldKey && oldKey !== key) {
    try {
      await env.IMAGES.delete(oldKey);
    } catch {
      // Best-effort cleanup — don't fail the upload if deletion fails.
    }
  }

  return NextResponse.json({ url });
}
