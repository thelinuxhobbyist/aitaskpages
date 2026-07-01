import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createPageMetadata } from "@/lib/seo";
import { Check } from "lucide-react";

export const metadata: Metadata = createPageMetadata({
  title: "Join as an AI expert",
  description:
    "Join AI Jobs Market and list your profile in the UK's AI expert directory.",
  path: "/join-as-expert",
});

const features = [
  "A public expert profile in the UK directory",
  "Visibility in search results",
  "Enquiries from businesses via your dashboard",
  "Skills, services, and availability on your profile",
  "Direct contact with clients — no platform fees on your work",
];

export default function JoinAsExpertPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary text-on-primary">
        <div className="relative mx-auto max-w-3xl px-4 py-12 text-center md:py-16">
          <span className="brand-rule brand-rule-center mb-5 bg-accent" aria-hidden />
          <h1 className="font-heading text-3xl tracking-tight md:text-4xl">
            Join as an AI Expert
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-on-primary/85 md:text-lg">
            List your profile on AI Jobs Market and connect with UK businesses
            looking for AI expertise.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-lg px-4 py-12 md:py-14">
        <Card className="md-elevation-1">
          <CardHeader className="space-y-2 pb-2 text-center">
            <CardTitle className="text-2xl">Get started</CardTitle>
            <CardDescription className="text-base">
              Sign up to create your expert profile. Here&apos;s what you&apos;ll
              have access to:
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-6 pb-8 pt-2 md:px-8">
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm md:text-base">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border border-accent/30 bg-accent-muted">
                    <Check className="h-3.5 w-3.5 text-accent" />
                  </span>
                  <span className="text-on-surface">{feature}</span>
                </li>
              ))}
            </ul>

            <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
              <Button className="w-full" size="lg">
                Sign up and create your profile
              </Button>
            </SignUpButton>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
