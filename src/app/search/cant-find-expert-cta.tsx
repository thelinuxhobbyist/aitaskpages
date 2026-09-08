import { DocumentLink } from "@/components/document-link";

/**
 * Fallback action for visitors the directory could not satisfy.
 *
 * Renders after the results so the hierarchy stays Search → Results → "Can't
 * find what you need?" → Post a task, which matters most on mobile where the
 * two stack vertically.
 */
export function CantFindExpertCta() {
  return (
    <div className="mt-10 rounded-xl border border-primary/20 bg-primary/[0.04] px-5 py-4">
      <p className="text-sm font-medium text-secondary">
        Can&apos;t find what you need?
      </p>
      <p className="mt-1 text-sm text-muted">
        Post a task and let matching AI experts come to you. We make the
        introduction; you take it from there.
      </p>
      <DocumentLink
        href="/tasks/new"
        className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
      >
        Post a task →
      </DocumentLink>
    </div>
  );
}
