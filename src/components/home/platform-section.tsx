import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  id?: string;
  title: string;
  description?: string;
  browseHref: string;
  browseLabel: string;
  children: React.ReactNode;
};

export function PlatformSection({
  id,
  title,
  description,
  browseHref,
  browseLabel,
  children,
}: Props) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-secondary md:text-2xl">
            {title}
          </h2>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-muted md:text-base">
              {description}
            </p>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
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
