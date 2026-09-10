import Link from "next/link";
import { SITE_LOGO_ON_DARK_PATH, SITE_LOGO_PATH } from "@/lib/site";
import { SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  /** Larger variant for footer and marketing surfaces */
  size?: "header" | "footer";
};

const logoSizeClasses = {
  /** Stacked lockup — header bar is taller so this can sit at a readable size */
  header: "h-14 w-auto sm:h-16",
  footer: "h-14 w-auto md:h-16",
} as const;

export function BrandMark({ className, size = "header" }: BrandMarkProps) {
  const src = size === "footer" ? SITE_LOGO_ON_DARK_PATH : SITE_LOGO_PATH;

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
        width={245}
        height={100}
        fetchPriority="high"
      />
    </Link>
  );
}
