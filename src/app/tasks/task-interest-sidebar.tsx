import Link from "next/link";
import { InterestButton } from "@/app/dashboard/opportunities/interest-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export type TaskInterestViewer =
  | { kind: "signed_out" }
  | { kind: "owner" }
  | { kind: "syncing" }
  | { kind: "needs_profile" }
  | { kind: "pending_profile" }
  | { kind: "unverified" }
  | { kind: "ready"; alreadyInterested: boolean };

type Props = {
  requirementId: number;
  posterLabel: string;
  budgetLabel: string | null;
  viewer: TaskInterestViewer;
  className?: string;
};

export function TaskInterestSidebar({
  requirementId,
  posterLabel,
  budgetLabel,
  viewer,
  className,
}: Props) {
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(`/tasks/${requirementId}`)}`;

  return (
    <aside
      className={cn(
        "rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-7",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Connect
      </p>
      <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-secondary md:text-[1.65rem] md:leading-snug">
        Think you could help?
      </h2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
        If this sounds relevant to your expertise, connect directly with{" "}
        <span className="font-medium text-on-surface">{posterLabel}</span>. We
        don&apos;t manage the work — we just make the introduction.
      </p>

      {budgetLabel && (
        <p className="mt-4 text-sm text-muted">
          Guide budget{" "}
          <span className="font-semibold text-secondary">{budgetLabel}</span>
        </p>
      )}

      <div className="mt-6 space-y-3 border-t border-border pt-6">
        {viewer.kind === "owner" && (
          <>
            <p className="text-sm leading-relaxed text-muted">
              This is your request. People with relevant expertise can connect
              with you here.
            </p>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href={`/dashboard/requirements/${requirementId}`}>
                Edit your request
              </Link>
            </Button>
          </>
        )}

        {viewer.kind === "signed_out" && (
          <>
            <Button asChild className="w-full" size="lg">
              <Link href={signInHref}>
                I can help
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-sm leading-relaxed text-muted">
              Sign in so you can connect with the person who posted this.
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
              <Link href="/dashboard?intent=offer">
                I can help
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-sm leading-relaxed text-muted">
              Add a short profile so they can see your relevant expertise
              before you connect.
            </p>
          </>
        )}

        {viewer.kind === "pending_profile" && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
            Your profile needs to be live before you can connect.
          </p>
        )}

        {viewer.kind === "unverified" && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
            Verify your email address before connecting.
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
