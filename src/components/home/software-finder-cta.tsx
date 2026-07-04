import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SoftwareFinderCta() {
  return (
    <section
      id="software-finder"
      className="scroll-mt-20 rounded-2xl border border-border bg-surface-container px-6 py-10 md:px-10 md:py-12"
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-secondary md:text-2xl">
          Looking for the right AI software?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
          Describe your business challenge in plain English and get AI software
          recommendations — with clear reasons why each one fits. No jargon, no
          guesswork.
        </p>
        <Button asChild size="lg" className="mt-6">
          <a
            href="https://finder.aijobsmarket.co.uk"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open AI Software Finder
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}
