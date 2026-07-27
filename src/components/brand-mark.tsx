import Link from "next/link";
import { SITE_LOGO_URL } from "@/lib/site";
import { SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  /** Larger variant for footer and marketing surfaces */
  size?: "header" | "footer";
};

const logoSizeClasses = {
  /** Full logo — readable in the header bar */
  header: "h-[3.25rem] w-auto sm:h-[3.625rem] md:h-[4.25rem]",
  footer: "h-12 w-auto md:h-14",
} as const;

export function BrandMark({ className, size = "header" }: BrandMarkProps) {
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
        src={SITE_LOGO_URL}
        alt={SITE_NAME}
        className={cn("block shrink-0", logoSizeClasses[size])}
        width={128}
        height={64}
        fetchPriority="high"
      />
    </Link>
  );
}
