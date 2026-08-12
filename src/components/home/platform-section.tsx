import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  id?: string;
  title: string;
  description?: string;
  browseHref: string;
  browseLabel: string;
  /** Quieter presentation for secondary homepage features. */
  secondary?: boolean;
  children: React.ReactNode;
};

export function PlatformSection({
  id,
  title,
  description,
  browseHref,
  browseLabel,
  secondary = false,
  children,
}: Props) {
  return (
    <section
      id={id}
      className={secondary ? "scroll-mt-20 border-t border-border/50 pt-12" : "scroll-mt-20"}
    >
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className={secondary ? "text-[clamp(1.375rem,2.5vw,1.75rem)] text-muted" : undefined}>
            {title}
          </h2>
          {description && (
            <p
              className={
                secondary
                  ? "mt-2 max-w-2xl text-[0.9375rem] leading-[1.6] text-muted"
                  : "section-lead"
              }
            >
              {description}
            </p>
          )}
        </div>
        <Button
          asChild
          variant={secondary ? "ghost" : "outline"}
          size="default"
          className={
            secondary
              ? "shrink-0 rounded-xl text-[0.875rem] text-muted"
              : "shrink-0 rounded-xl text-[0.9375rem] shadow-soft"
          }
        >
          <Link href={browseHref}>
            {browseLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      {children}
    </section>
  );
}
