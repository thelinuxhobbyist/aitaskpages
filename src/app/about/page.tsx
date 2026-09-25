import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "About AI Task Pages — a platform for posting AI tasks and connecting with AI experts who may be able to help. We make the introduction; you take it from there.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-secondary">About {SITE_NAME}</h1>

      <p className="mt-6 text-lg font-medium leading-relaxed text-secondary">
        Connecting people who need AI expertise with the people and companies
        who can provide it.
      </p>

      <section className="mt-10 space-y-4">
        <p>
          {SITE_NAME} is an introduction platform for finding AI expertise and
          connecting around AI-related work.
        </p>
        <p>
          People and businesses can find AI professionals and companies by
          skills and services, or post an AI task so relevant specialists can
          express interest. Profiles can be reviewed, and connections happen
          directly between the parties involved.
        </p>
        <p>
          We make the introduction. What happens after that — including any
          working relationship, contracts, payments or delivery — is between
          you and the person or company you connect with.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">What we do</h2>
        <ul className="list-disc space-y-3 pl-6">
          <li>
            <strong>Find AI professionals and companies</strong> — Search by
            skills and services to discover relevant expertise.
          </li>
          <li>
            <strong>Post an AI task</strong> — Describe what you need and allow
            relevant specialists to express interest.
          </li>
          <li>
            <strong>Review profiles and connect directly</strong> — Decide who
            you want to speak with and take the conversation forward yourselves.
          </li>
        </ul>
        <p>
          {SITE_NAME} does not manage contracts, payments, delivery or the
          working relationship between people who connect through the platform.
        </p>
        <p className="font-medium text-secondary">
          Find the right expertise. Describe what you need. Make the
          connection.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-secondary">Who it&apos;s for</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary">
            For businesses and individuals
          </h3>
          <p>
            Find AI professionals or companies, or post a task and let relevant
            specialists come to you.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary">
            For AI professionals and companies
          </h3>
          <p>
            Create a profile, showcase skills and services, become discoverable
            and express interest in relevant tasks.
          </p>
        </div>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          Why AI Task Pages?
        </h2>
        <p>
          AI expertise is becoming increasingly specialised, but finding the
          right person isn&apos;t always straightforward.
        </p>
        <p>
          {SITE_NAME} provides a simple place where people looking for AI
          expertise and people providing it can find each other.
        </p>
        <p>
          We aren&apos;t trying to become the middleman. Our role is to make the
          introduction and provide the place where that connection can happen.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">Our approach</h2>
        <p>{SITE_NAME} is designed around direct connections.</p>
        <p>
          There are no commissions on work arranged between people who connect
          through the platform, and we don&apos;t take part in negotiating or
          managing the work itself.
        </p>
        <p>
          Once an introduction is made, the people involved decide whether they
          want to work together and agree the details directly.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">Get started</h2>
        <p>
          Whether you need AI expertise or offer it, you can get started on{" "}
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
            href="/create-a-profile"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary hover:bg-surface"
          >
            Create a profile
          </Link>
        </div>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-3 text-sm text-muted">
        <h2 className="text-base font-medium text-muted">
          From the team behind AI Jobs Market
        </h2>
        <p>
          {SITE_NAME} and AI Jobs Market share the same underlying idea: making
          it easier for people who need AI expertise to connect directly with
          people who have it.
        </p>
        <p>
          AI Jobs Market focuses on the UK, while {SITE_NAME} is designed for an
          international audience.
        </p>
      </section>
    </article>
  );
}
