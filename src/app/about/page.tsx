import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "About AI Task Pages — an introduction platform for finding AI expertise and connecting around AI-related work. We make the introduction; you take it from there.",
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
          Businesses and individuals can search for AI professionals and
          companies by their skills and services, or describe what they need by
          posting a task. AI experts can create profiles, be discovered through
          search, and express interest in tasks that match their expertise.
        </p>
        <p>
          We make the introduction. What happens after that is between you and
          the person or company you connect with.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">What we do</h2>
        <ul className="list-disc space-y-3 pl-6">
          <li>
            <strong>Find AI expertise</strong> — Search profiles of AI
            professionals and companies by skills, services and areas of
            expertise.
          </li>
          <li>
            <strong>Post an AI task</strong> — Describe what you need and let
            relevant AI specialists discover your task and express their
            interest.
          </li>
          <li>
            <strong>Connect directly</strong> — Review profiles, decide who you
            want to speak with, and take the conversation forward directly.
          </li>
        </ul>
        <p>
          We don&apos;t manage the work, contracts, delivery or payments between
          people who connect through the platform.
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
            If you need help with AI, you can search for someone with the right
            expertise or post a task describing what you need.
          </p>
          <p>
            You decide who you want to contact and how you want to work
            together.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary">
            For AI professionals and companies
          </h3>
          <p>
            Create a profile describing your expertise, skills and services.
            Your profile can be discovered by people and businesses looking for
            AI help.
          </p>
          <p>
            You can also browse open tasks and express interest when you see
            something that matches your expertise.
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
        <p className="font-medium text-secondary">
          Find the right expertise. Describe what you need. Make the
          connection.
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
          Part of the AI Jobs Market family
        </h2>
        <p>
          {SITE_NAME} and AI Jobs Market share the same underlying idea: making
          it easier for people who need AI expertise to connect directly with
          people who have it.
        </p>
        <p>
          AI Jobs Market is focused on the UK, while {SITE_NAME} is designed for
          an international audience.
        </p>
      </section>
    </article>
  );
}
