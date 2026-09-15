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
  viewer: TaskInterestViewer;
  className?: string;
};

function signInHref(requirementId: number) {
  return `/sign-in?redirect_url=${encodeURIComponent(`/tasks/${requirementId}`)}`;
}

function InterestActions({
  requirementId,
  viewer,
  compact,
}: {
  requirementId: number;
  viewer: TaskInterestViewer;
  compact?: boolean;
}) {
  const href = signInHref(requirementId);

  if (viewer.kind === "owner") {
    return (
      <>
        {!compact && (
          <p className="text-sm leading-relaxed text-muted">
            This is your request. People with relevant expertise can introduce
            themselves here.
          </p>
        )}
        <Button asChild variant="outline" className="w-full" size="lg">
          <Link href={`/dashboard/requirements/${requirementId}`}>
            Edit your request
          </Link>
        </Button>
      </>
    );
  }

  if (viewer.kind === "signed_out") {
    return (
      <>
        <Button asChild className="w-full" size="lg">
          <Link href={href}>
            I can help
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        {!compact && (
          <p className="text-sm leading-relaxed text-muted">
            Sign in so you can introduce yourself to the person who posted this.
          </p>
        )}
      </>
    );
  }

  if (viewer.kind === "syncing") {
    if (compact) {
      return (
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/account/setup">Finish setup</Link>
        </Button>
      );
    }
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
        Your account is still syncing.{" "}
        <Link href="/account/setup" className="font-medium underline">
          Finish setup
        </Link>{" "}
        or try again shortly.
      </p>
    );
  }

  if (viewer.kind === "needs_profile") {
    return (
      <>
        <Button asChild className="w-full" size="lg">
          <Link href="/dashboard?intent=offer">
            I can help
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        {!compact && (
          <p className="text-sm leading-relaxed text-muted">
            Create a profile so they can see your expertise before you
            connect.
          </p>
        )}
      </>
    );
  }

  if (viewer.kind === "pending_profile") {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
        Your profile needs to be live before you can introduce yourself.
      </p>
    );
  }

  if (viewer.kind === "unverified") {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
        Verify your email address before introducing yourself.
      </p>
    );
  }

  return (
    <InterestButton
      requirementId={requirementId}
      alreadyInterested={viewer.alreadyInterested}
      compact
    />
  );
}

export function TaskInterestSidebar({
  requirementId,
  posterLabel,
  viewer,
  className,
}: Props) {
  return (
    <aside
      className={cn(
        "lg:border-l lg:border-on-surface/20 lg:pl-8 xl:pl-10",
        className
      )}
    >
      <h2 className="font-heading text-[1.65rem] font-semibold leading-snug tracking-tight text-secondary xl:text-[1.75rem]">
        Think you could help?
      </h2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
        If this task looks relevant, introduce yourself to{" "}
        <span className="font-medium text-on-surface">{posterLabel}</span>.
      </p>

      <div className="mt-6 space-y-3">
        <InterestActions requirementId={requirementId} viewer={viewer} />
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted">
        AI Task Pages makes the introduction. After that, you take things
        forward directly — we don&apos;t manage payments or the work itself.
      </p>
    </aside>
  );
}

function mobileCopy(
  viewer: TaskInterestViewer,
  posterLabel: string
): { title: string; detail: string; showAction: boolean } {
  if (viewer.kind === "ready" && viewer.alreadyInterested) {
    return {
      title: "They have your introduction",
      detail: `${posterLabel} can see your profile and get in touch.`,
      showAction: false,
    };
  }
  if (viewer.kind === "owner") {
    return {
      title: "This is your request",
      detail: "Experts can introduce themselves here.",
      showAction: true,
    };
  }
  if (viewer.kind === "syncing") {
    return {
      title: "Account still syncing",
      detail: "Finish setup, then you can introduce yourself.",
      showAction: true,
    };
  }
  if (viewer.kind === "pending_profile") {
    return {
      title: "Profile not live yet",
      detail: "It needs to be live before you can introduce yourself.",
      showAction: false,
    };
  }
  if (viewer.kind === "unverified") {
    return {
      title: "Verify your email",
      detail: "Then you can introduce yourself on this task.",
      showAction: false,
    };
  }
  return {
    title: "Think you could help?",
    detail: `Introduce yourself to ${posterLabel}.`,
    showAction: true,
  };
}

export function TaskMobileCta({
  requirementId,
  posterLabel,
  viewer,
}: Props) {
  const copy = mobileCopy(viewer, posterLabel);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 py-3 shadow-[0_-8px_24px_oklch(19%_0.02_250_/_0.08)] backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-secondary">
            {copy.title}
          </p>
          <p className="truncate text-xs text-muted">{copy.detail}</p>
        </div>
        {copy.showAction ? (
          <div className="shrink-0 [&_button]:h-11 [&_button]:min-w-[8.25rem] [&_button]:text-sm [&_form]:m-0">
            <InterestActions
              requirementId={requirementId}
              viewer={viewer}
              compact
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
