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
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2>{title}</h2>
          {description && <p className="section-lead">{description}</p>}
        </div>
        <Button
          asChild
          variant="outline"
          size="default"
          className="shrink-0 rounded-xl text-[0.9375rem] shadow-soft"
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
