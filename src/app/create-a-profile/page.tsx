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
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";
import { Check } from "lucide-react";

export const metadata: Metadata = createPageMetadata({
  title: "Create a Profile",
  description:
    "Create an individual or company profile on AI Task Pages. Showcase your AI skills and services, become discoverable, and connect around relevant AI tasks.",
  path: "/create-a-profile",
});

const features = [
  "A public profile in Find AI Expertise — as an individual or a company",
  "Visibility in search results",
  "A place to showcase skills and services",
  "The ability to express interest in relevant open tasks",
  "Direct introductions — you agree terms yourselves",
];

export default function CreateAProfilePage() {
  return (
    <>
      <PageHero innerClassName="max-w-3xl py-12 text-center md:py-16">
        <span className="brand-rule brand-rule-center mb-5 bg-accent" aria-hidden />
        <h1 className="font-heading text-3xl tracking-tight md:text-4xl">
          Create a profile
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          Choose Individual or Company, then list your AI expertise on AI Task
          Pages. Become discoverable in Find AI Expertise and express interest
          in open AI tasks. We make the introduction — you take it from there.
        </p>
      </PageHero>

      <div className="mx-auto max-w-lg px-4 py-12 md:py-14">
        <Card className="md-elevation-1">
          <CardHeader className="space-y-2 pb-2 text-center">
            <CardTitle className="text-2xl">Get started</CardTitle>
            <CardDescription className="text-base">
              Sign up to create your profile. You&apos;ll choose Individual or
              Company as the first step. Here&apos;s what you&apos;ll have
              access to:
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

            <SignUpButton
              mode="redirect"
              fallbackRedirectUrl="/dashboard?intent=offer"
            >
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
