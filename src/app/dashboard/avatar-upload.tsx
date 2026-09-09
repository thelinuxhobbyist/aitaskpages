"use client";

import { useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  defaultUrl?: string | null;
  /** Defaults to a personal photo; companies upload a logo. */
  variant?: "photo" | "logo";
};

export function AvatarUpload({ name, defaultUrl, variant = "photo" }: Props) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      if (url) body.append("previousUrl", url);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Upload failed. Please try again.");
      }
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar
        src={url || null}
        alt={name || (variant === "logo" ? "Company logo" : "Your profile photo")}
        className="h-20 w-20"
        textClassName="text-xl"
      />

      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFile}
        />
        {/* Submitted with the profile form. */}
        <input type="hidden" name="profileImageUrl" value={url} />

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading
              ? "Uploading…"
              : url
                ? variant === "logo"
                  ? "Change logo"
                  : "Change photo"
                : variant === "logo"
                  ? "Upload logo"
                  : "Upload photo"}
          </Button>
          {url && !uploading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUrl("")}
            >
              Remove
            </Button>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-xs text-muted">
          JPEG, PNG, WebP or GIF. Max 5MB.
          {variant === "logo"
            ? " Leave blank to use your company initials."
            : " Leave blank to use your initials."}
        </p>
      </div>
    </div>
  );
}
