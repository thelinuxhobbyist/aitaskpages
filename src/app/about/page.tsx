import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "About AI Jobs Market — the UK platform where businesses find independent AI experts and post AI tasks, projects and requirements.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-secondary">About {SITE_NAME}</h1>

      <p className="mt-6 text-lg font-medium leading-relaxed text-secondary">
        Connecting people who need AI work done with people who have the
        expertise to deliver it.
      </p>

      <section className="mt-10 space-y-4">
        <p>
          {SITE_NAME} is the UK&apos;s AI expert directory and task marketplace.
          Businesses and individuals use the platform to find independent AI
          consultants, post project requirements, and connect directly with
          specialists who can help with AI consulting, automation, integrations,
          machine learning and custom AI solutions.
        </p>
        <p>
          We are not a traditional job board. Vacancy-style listings may appear
          as supporting content, but the core product is matching demand for AI
          work with independent experts — through searchable profiles and open
          tasks that specialists can express interest in.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">What we do</h2>
        <ul className="list-disc space-y-3 pl-6">
          <li>
            <strong>AI expert directory</strong> — Search independent AI
            freelancers and consultants by skills, services and location.
          </li>
          <li>
            <strong>AI tasks and requirements</strong> — Post what you need done;
            experts review open tasks and express interest so you can choose who
            to contact.
          </li>
          <li>
            <strong>Direct connections</strong> — Message on the platform and
            agree terms yourselves. No commissions or platform fees on the work.
          </li>
        </ul>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-secondary">Who it&apos;s for</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary">For businesses</h3>
          <p>
            Find AI professionals who can provide consulting, implementation
            support and specialist delivery — or post a task and let matching
            experts come to you.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary">
            For AI experts
          </h3>
          <p>
            Create a public profile, showcase skills and services, get discovered
            in search, and express interest in open tasks from UK businesses.
          </p>
        </div>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">Our mission</h2>
        <p className="text-lg font-semibold text-secondary">
          Make AI expertise accessible — without middlemen taking a cut.
        </p>
        <p>
          Businesses of every size should be able to find the right specialist,
          and independent AI professionals should have a straightforward way to
          showcase their work and win projects.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">Get started</h2>
        <p>
          Search the expert directory, post an AI task, or join as an expert on{" "}
          {SITE_NAME}.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/search"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Browse AI experts
          </Link>
          <Link
            href="/tasks"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary hover:bg-surface"
          >
            Browse AI tasks
          </Link>
          <Link
            href="/join-as-expert"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary hover:bg-surface"
          >
            Join as an expert
          </Link>
        </div>
      </section>
    </article>
  );
}
