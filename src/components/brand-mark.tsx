import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  /** Larger variant for footer and marketing surfaces */
  size?: "header" | "footer";
};

const logoSizeClasses = {
  header: "h-6 w-auto sm:h-7",
  footer: "h-6 w-auto md:h-7",
} as const;

function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150 24"
      width={150}
      height={24}
      role="img"
      aria-label={SITE_NAME}
      className={cn("block shrink-0", className)}
    >
      <title>{SITE_NAME}</title>
      <text
        x="0"
        y="18"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
        fontSize="19"
        letterSpacing="-0.4"
        fill="currentColor"
      >
        <tspan fontWeight="700">AI</tspan>
        <tspan fontWeight="500" dx="5">
          Task Pages
        </tspan>
      </text>
    </svg>
  );
}

export function BrandMark({ className, size = "header" }: BrandMarkProps) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME} — home`}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        size === "footer" ? "text-white" : "text-on-surface",
        className,
      )}
    >
      <Wordmark className={logoSizeClasses[size]} />
    </Link>
  );
}
