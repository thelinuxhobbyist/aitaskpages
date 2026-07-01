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
      <div className="rounded-[1.125rem] border border-border/80 bg-slate-50/80 px-6 py-8">
        <h2 className="text-lg font-semibold text-secondary">
          Interested in this opportunity?
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Sign in as an AI expert to express interest. The business will be
          notified and can contact you through your profile.
        </p>
        <Button asChild className="mt-5">
          <Link
            href={`/sign-in?redirect_url=${encodeURIComponent(`/tasks/${requirementId}`)}`}
          >
            Sign in as an expert
          </Link>
        </Button>
      </div>
    );
  }

  if (!user.profile) {
    return (
      <div className="rounded-[1.125rem] border border-border/80 bg-slate-50/80 px-6 py-8">
        <h2 className="text-lg font-semibold text-secondary">
          Interested in this opportunity?
        </h2>
        <p className="mt-2 text-sm text-muted">
          Create your expert profile to express interest in tasks.
        </p>
        <Button asChild className="mt-5">
          <Link href="/dashboard">Create expert profile</Link>
        </Button>
      </div>
    );
  }

  if (user.profile.status !== PUBLIC_PROFILE_STATUS) {
    return (
      <div className="rounded-[1.125rem] border border-amber-200 bg-amber-50 px-6 py-6 text-sm text-amber-900">
        Your expert profile must be approved before you can express interest.
      </div>
    );
  }

  if (!identity?.emailVerified) {
    return (
      <div className="rounded-[1.125rem] border border-amber-200 bg-amber-50 px-6 py-6 text-sm text-amber-900">
        Verify your email address before expressing interest.
      </div>
    );
  }

  const alreadyInterested = await hasExpertInterest(
    requirementId,
    user.profile.id
  );

  return (
    <div className="rounded-[1.125rem] border border-border/80 bg-slate-50/80 px-6 py-8">
      <h2 className="text-lg font-semibold text-secondary">
        Express your interest
      </h2>
      <p className="mt-2 text-sm text-muted">
        The business will be notified. If they&apos;re interested, they&apos;ll
        contact you via your profile.
      </p>
      <div className="mt-5">
        <InterestButton
          requirementId={requirementId}
          alreadyInterested={alreadyInterested}
        />
      </div>
    </div>
  );
}
