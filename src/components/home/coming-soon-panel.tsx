import { Sparkles } from "lucide-react";

/** Placeholder for a future AI Software directory section. */
export function ComingSoonPanel() {
  return (
    <section
      id="ai-software"
      className="scroll-mt-20 rounded-2xl border border-dashed border-border bg-surface px-6 py-10 md:px-10"
    >
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            In development
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-secondary">
            AI Software Directory
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
            A future section for discovering AI tools alongside experts and
            tasks — planned as an addition to the live platform.
          </p>
        </div>
        <span className="rounded-full bg-surface-container px-4 py-1.5 text-xs font-medium text-muted">
          Not available yet
        </span>
      </div>
    </section>
  );
}
