"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string | null;
  alt: string;
  /** Size + ring classes, e.g. "h-14 w-14 ring-2". */
  className?: string;
  /** Text size for the initials fallback, e.g. "text-lg". */
  textClassName?: string;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Upgrades insecure http URLs to https. On an https page, mixed-content images
 * are blocked silently without firing onError, which would leave the alt text
 * (the person's name) showing instead of the initials fallback.
 */
function normalizeImageSrc(src: string): string {
  return src.startsWith("http://") ? src.replace(/^http:\/\//, "https://") : src;
}

export function Avatar({ src, alt, className, textClassName }: AvatarProps) {
  const [errored, setErrored] = useState(false);

  if (src && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={normalizeImageSrc(src)}
        alt={alt}
        onError={() => setErrored(true)}
        className={cn(
          "shrink-0 rounded-full object-cover ring-2 ring-border",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary ring-2 ring-border",
        className
      )}
      role="img"
      aria-label={alt}
    >
      <span className={cn("leading-none", textClassName)}>
        {getInitials(alt)}
      </span>
    </div>
  );
}
