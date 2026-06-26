import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

const freeFeatures = [
  "Public expert profile in the directory",
  "Listed in search results",
  "Receive contact enquiries via email",
  "Skills and services showcase",
];

const proFeatures = [
  "Featured placement in search results",
  "Priority ranking",
  "Enhanced profile badge",
  "Analytics dashboard",
];

export default function JoinAsExpertPage() {
  return (
    <>
      <section className="bg-primary-container text-on-primary-container">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
            Join as an AI Expert
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg opacity-90">
            Get discovered by UK businesses looking for AI freelancers and
            consultants. This is a directory — not a marketplace. You keep 100%
            of what you earn.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Everything you need to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold text-secondary">
              £0
              <span className="text-base font-normal text-muted">/month</span>
            </p>
            <ul className="space-y-2">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
              <Button className="w-full" size="lg">
                Sign up free
              </Button>
            </SignUpButton>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>Coming soon — no payment required today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold text-secondary">
              TBC
              <span className="text-base font-normal text-muted">/month</span>
            </p>
            <ul className="space-y-2">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full" size="lg" variant="outline" disabled>
              Coming soon
            </Button>
          </CardContent>
        </Card>
      </div>

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
