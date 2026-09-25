import { ExternalPrefetchLink } from "@/components/external-prefetch-link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SoftwareFinderCta() {
  return (
    <section
      id="software-finder"
      className="scroll-mt-20 rounded-2xl border border-border bg-white px-6 py-10 md:px-10 md:py-12"
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-accent-muted text-accent">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-4">Looking for the right AI software?</h2>
        <p className="mx-auto mt-3.5 max-w-xl text-lg leading-[1.65] text-muted">
          Describe your business challenge in plain English and get AI software
          recommendations — with clear reasons why each one fits. No jargon, no
          guesswork.
        </p>
        <Button asChild variant="ink" size="lg" className="mt-6 rounded-xl">
          <ExternalPrefetchLink target="_blank" rel="noopener noreferrer">
            Open AI Software Finder
            <ArrowRight className="h-4 w-4" />
          </ExternalPrefetchLink>
        </Button>
      </div>
    </section>
  );
}
