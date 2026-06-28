import Link from "next/link";
import { InterestButton } from "@/app/dashboard/opportunities/interest-button";
import { Button } from "@/components/ui/button";
import { getAuthIdentity, getOrCreateUser } from "@/lib/auth";
import { PUBLIC_PROFILE_STATUS } from "@/lib/directory-filters";
import { hasExpertInterest } from "@/lib/requirements";

type Props = {
  requirementId: number;
};

export async function RequirementInterestPanel({ requirementId }: Props) {
  const [user, identity] = await Promise.all([
    getOrCreateUser(),
    getAuthIdentity(),
  ]);

  if (!user) {
    return (
      <div className="rounded-lg border border-border bg-surface px-5 py-4">
        <p className="text-sm font-medium text-secondary">
          Interested in this opportunity?
        </p>
        <p className="mt-1 text-sm text-muted">
          Sign in as an AI expert to express interest. The business will be
          notified and can contact you via your profile.
        </p>
        <Button asChild className="mt-4">
          <Link
            href={`/sign-in?redirect_url=${encodeURIComponent(`/requirements/${requirementId}`)}`}
          >
            Sign in as an expert
          </Link>
        </Button>
      </div>
    );
  }

  if (!user.profile) {
    return (
      <div className="rounded-lg border border-border bg-surface px-5 py-4">
        <p className="text-sm font-medium text-secondary">
          Interested in this opportunity?
        </p>
        <p className="mt-1 text-sm text-muted">
          Create your expert profile to express interest in requirements.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Create expert profile</Link>
        </Button>
      </div>
    );
  }

  if (user.profile.status !== PUBLIC_PROFILE_STATUS) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        Your expert profile must be approved before you can express interest.
      </div>
    );
  }

  if (!identity?.emailVerified) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        Verify your email address before expressing interest.
      </div>
    );
  }

  const alreadyInterested = await hasExpertInterest(
    requirementId,
    user.profile.id
  );

  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-4">
      <p className="text-sm font-medium text-secondary">Express your interest</p>
      <p className="mt-1 text-sm text-muted">
        The business will be notified. If they&apos;re interested, they&apos;ll
        contact you via your profile.
      </p>
      <div className="mt-4">
        <InterestButton
          requirementId={requirementId}
          alreadyInterested={alreadyInterested}
        />
      </div>
    </div>
  );
}
