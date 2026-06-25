import Link from "next/link";
import { FreelancerCard } from "@/app/freelancers/freelancer-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDirectoryStats } from "@/lib/directory";
import { Briefcase, Search, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { expertCount } = await getDirectoryStats();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-slate-800 to-secondary text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            UK AI Jobs &amp;{" "}
            <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              Expert Directory
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Find AI and ML roles from Reed.co.uk, or hire freelance AI experts
            for consulting, model development, and more.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/index.html">Browse AI Jobs</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-500 bg-transparent text-white hover:bg-slate-700"
            >
              <Link href="/freelancers">Find AI Experts</Link>
            </Button>
          </div>
          {expertCount > 0 && (
            <p className="mt-6 text-sm text-slate-400">
              {expertCount} expert{expertCount !== 1 ? "s" : ""} in the
              directory
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-primary/20">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <CardTitle>AI Jobs Board</CardTitle>
              <CardDescription>
                Curated AI, ML, and data science roles across the UK — powered
                by Reed.co.uk.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/index.html">Search jobs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Users className="h-5 w-5" />
              </div>
              <CardTitle>AI Expert Directory</CardTitle>
              <CardDescription>
                Discover freelancers and consultants. Contact experts directly —
                no marketplace fees.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/freelancers">
                  <Search className="h-4 w-4" />
                  Browse experts
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/join-as-expert">List your profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
