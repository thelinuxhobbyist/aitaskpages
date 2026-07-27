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
          <h2>{title}</h2>
          {description && (
            <p className="mt-3 max-w-lg text-muted">{description}</p>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0 rounded-xl shadow-soft">
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
