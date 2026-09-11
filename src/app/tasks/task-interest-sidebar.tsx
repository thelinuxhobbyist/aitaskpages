import Link from "next/link";
import { InterestButton } from "@/app/dashboard/opportunities/interest-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewerState =
  | { kind: "signed_out" }
  | { kind: "syncing" }
  | { kind: "needs_profile" }
  | { kind: "pending_profile" }
  | { kind: "unverified" }
  | { kind: "ready"; alreadyInterested: boolean };

type Props = {
  requirementId: number;
  budgetLabel: string | null;
  viewer: ViewerState;
  className?: string;
};

export function TaskInterestSidebar({
  requirementId,
  budgetLabel,
  viewer,
  className,
}: Props) {
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(`/tasks/${requirementId}`)}`;

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6",
        className
      )}
    >
      <div>
        <p className="font-heading text-3xl font-semibold tracking-tight text-secondary">
          {budgetLabel ?? "Budget TBC"}
        </p>
        <p className="mt-1 text-sm font-medium text-muted">Budget</p>
      </div>

      <div className="mt-5 space-y-3 border-t border-border pt-5">
        {viewer.kind === "signed_out" && (
          <>
            <Button asChild className="w-full" size="lg">
              <Link href={signInHref}>Show interest</Link>
            </Button>
            <p className="text-sm leading-relaxed text-muted">
              The business reviews your expert profile if you show interest.
            </p>
          </>
        )}

        {viewer.kind === "syncing" && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
            Your account is still syncing.{" "}
            <Link href="/account/setup" className="font-medium underline">
              Finish setup
            </Link>{" "}
            or try again shortly.
          </p>
        )}

        {viewer.kind === "needs_profile" && (
          <>
            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard?intent=offer">Show interest</Link>
            </Button>
            <p className="text-sm leading-relaxed text-muted">
              Create your expert profile so the business can review your
              experience.
            </p>
          </>
        )}

        {viewer.kind === "pending_profile" && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
            Your expert profile must be live before you can show interest.
          </p>
        )}

        {viewer.kind === "unverified" && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
            Verify your email address before showing interest.
          </p>
        )}

        {viewer.kind === "ready" && (
          <InterestButton
            requirementId={requirementId}
            alreadyInterested={viewer.alreadyInterested}
            compact
          />
        )}
      </div>
    </aside>
  );
}
