import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus } from "lucide-react";

export function JoinAsExpertCta() {
  return (
    <section
      id="join-as-expert"
      className="scroll-mt-20 rounded-2xl border border-border bg-card px-6 py-10 shadow-soft md:px-10 md:py-12"
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-accent-muted text-accent-foreground">
          <UserPlus className="h-6 w-6" />
        </div>
        <h2 className="mt-4">Are you an AI expert?</h2>
        <p className="mx-auto mt-3.5 max-w-xl text-lg leading-[1.65] text-muted">
          Create your profile, showcase your skills, and get discovered by UK
          businesses posting AI requirements or searching the directory.
        </p>
        <Button asChild variant="ink" size="lg" className="mt-6 rounded-xl">
          <Link href="/join-as-expert">
            Join as an expert
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
