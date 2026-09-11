import Link from "next/link";
import type { ReactNode } from "react";
import { InterestButton } from "@/app/dashboard/opportunities/interest-button";
import { Button } from "@/components/ui/button";
import { getAuthIdentity, getOrCreateUser } from "@/lib/auth";
import { PUBLIC_PROFILE_STATUS } from "@/lib/directory-filters";
import { hasExpertInterest } from "@/lib/requirements";

type Props = {
  requirementId: number;
};

function InterestCard({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
      <h2>{title}</h2>
      <p className="section-lead max-w-2xl">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export async function RequirementInterestPanel({ requirementId }: Props) {
  const identity = await getAuthIdentity();
  if (!identity) {
    return (
      <InterestCard
        title="Interested in this opportunity?"
        intro="Sign in as an AI expert to express interest. The business will be notified and can contact you through your profile."
      >
        <Button asChild>
          <Link
            href={`/sign-in?redirect_url=${encodeURIComponent(`/tasks/${requirementId}`)}`}
          >
            Sign in as an expert
          </Link>
        </Button>
      </InterestCard>
    );
  }

  const user = await getOrCreateUser();
  if (!user) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6 text-sm text-amber-900">
        You&apos;re signed in, but your account is still syncing.{" "}
        <Link href="/account/setup" className="font-medium underline">
          Finish setup
        </Link>{" "}
        or try again in a moment.
      </div>
    );
  }

  if (!user.profile) {
    return (
      <InterestCard
        title="Interested in this opportunity?"
        intro="Create your expert profile to express interest in tasks."
      >
        <Button asChild>
          <Link href="/dashboard?intent=offer">Create expert profile</Link>
        </Button>
      </InterestCard>
    );
  }

  if (user.profile.status !== PUBLIC_PROFILE_STATUS) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6 text-sm text-amber-900">
        Your expert profile must be approved before you can express interest.
      </div>
    );
  }

  if (!identity.emailVerified) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6 text-sm text-amber-900">
        Verify your email address before expressing interest.
      </div>
    );
  }

  const alreadyInterested = await hasExpertInterest(
    requirementId,
    user.profile.id
  );

  return (
    <InterestCard
      title="Express your interest"
      intro="The business will be notified. If they're interested, they'll contact you via your profile."
    >
      <InterestButton
        requirementId={requirementId}
        alreadyInterested={alreadyInterested}
      />
    </InterestCard>
  );
}
