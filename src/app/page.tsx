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
import { getDirectoryStats, getFeaturedFreelancers } from "@/lib/directory";
import { Briefcase, Search, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ expertCount }, featured] = await Promise.all([
    getDirectoryStats(),
    getFeaturedFreelancers(3),
  ]);

  return (
    <>
      <section className="bg-primary-container text-on-primary-container">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
          <p className="text-sm font-medium uppercase tracking-wide opacity-80">
            UK AI Expert Directory
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            Find AI freelancers &amp; consultants
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg opacity-90">
            Browse verified UK AI experts for consulting, model development, and
            more. No marketplace fees — contact experts directly.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/freelancers">
                <Search className="h-4 w-4" />
                Browse experts
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/join-as-expert">Join as an expert</Link>
            </Button>
          </div>
          {expertCount > 0 && (
            <p className="mt-6 text-sm opacity-75">
              {expertCount} expert{expertCount !== 1 ? "s" : ""} in the
              directory
            </p>
          )}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-medium text-on-surface">
                Featured experts
              </h2>
              <p className="mt-1 text-sm text-muted">
                Top profiles from the directory
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/freelancers">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((profile) => (
              <FreelancerCard key={profile.id} profile={profile} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-surface-container">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <CardTitle>Expert directory</CardTitle>
                <CardDescription>
                  Search by skills, services, location, and hourly rate. Hire
                  UK AI talent without platform fees.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/freelancers">Find experts</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/join-as-expert">List your profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <CardTitle>AI jobs board</CardTitle>
                <CardDescription>
                  Curated AI, ML, and data science roles across the UK — powered
                  by Reed.co.uk.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href="/index.html">Browse jobs</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
