import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus } from "lucide-react";

export function JoinAsExpertCta() {
  return (
    <section
      id="join-as-expert"
      className="scroll-mt-20 rounded-2xl bg-primary-container px-6 py-10 text-on-primary-container md:px-10 md:py-12"
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <UserPlus className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-semibold md:text-2xl">
          Are you an AI expert?
        </h2>
        <p className="mt-3 text-sm leading-relaxed opacity-90 md:text-base">
          Create your profile, showcase your skills, and get discovered by UK
          businesses posting AI requirements or searching the directory.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 bg-white text-primary hover:bg-white/90"
        >
          <Link href="/join-as-expert">
            Join as an expert
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
