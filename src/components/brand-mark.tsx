import Link from "next/link";
import { SITE_LOGO_ON_DARK_SVG_URL, SITE_LOGO_SVG_URL } from "@/lib/site";
import { SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  /** Larger variant for footer and marketing surfaces */
  size?: "header" | "footer";
};

const logoSizeClasses = {
  /** Wide lockup — keep height modest so the wordmark fits the bar */
  header: "h-10 w-auto sm:h-11",
  footer: "h-10 w-auto md:h-11",
} as const;

export function BrandMark({ className, size = "header" }: BrandMarkProps) {
  const src = size === "footer" ? SITE_LOGO_ON_DARK_SVG_URL : SITE_LOGO_SVG_URL;

  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME} — home`}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={SITE_NAME}
        className={cn("block shrink-0", logoSizeClasses[size])}
        width={700}
        height={180}
        fetchPriority="high"
      />
    </Link>
  );
}
