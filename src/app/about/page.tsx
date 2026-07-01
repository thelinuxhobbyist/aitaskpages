import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "AIJobsMarket helps people and businesses navigate the AI economy — AI jobs, expert directory, and resources in one place.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-secondary">About AIJobsMarket</h1>

      <p className="mt-6 text-lg font-medium leading-relaxed text-secondary">
        Helping people and businesses navigate the AI economy.
      </p>

      <section className="mt-10 space-y-4">
        <p>
          AIJobsMarket is a platform built to make finding AI opportunities
          simpler.
        </p>
        <p>
          Whether you&apos;re looking for your next role in artificial
          intelligence, searching for an experienced AI consultant, or exploring
          the growing AI industry, our goal is to bring everything together in
          one place.
        </p>
        <p>
          The AI landscape is evolving rapidly. New tools, companies, and careers
          emerge every day, making it difficult to know where to look.
          AIJobsMarket exists to reduce that complexity by creating a central hub
          for AI professionals and the organisations that need them.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">What We Do</h2>
        <p>
          AIJobsMarket combines several services designed around the AI
          employment market:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>AI Job Board</strong> – Browse AI-related jobs from a range
            of employers and discover new opportunities across multiple
            industries.
          </li>
          <li>
            <strong>AI Expert Directory</strong> – Find AI freelancers,
            consultants, and specialists available to help businesses implement
            AI solutions.
          </li>
          <li>
            <strong>AI Resources</strong> – Practical guides, tools, and
            information to help individuals and businesses understand the rapidly
            changing AI landscape. <em>(Coming soon.)</em>
          </li>
          <li>
            <strong>Future Services</strong> – As the platform grows,
            we&apos;ll continue introducing new features that support both job
            seekers and businesses.
          </li>
        </ul>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-secondary">Built for Everyone</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary">For Job Seekers</h3>
          <p>
            Whether you&apos;re taking your first steps into AI or you&apos;re an
            experienced machine learning engineer, AIJobsMarket helps you
            discover opportunities that match your skills and ambitions.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary">For Businesses</h3>
          <p>
            Finding AI talent shouldn&apos;t be complicated. Our platform helps
            businesses connect with AI professionals who can provide expertise,
            consulting, implementation support, and specialist knowledge.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary">
            For AI Professionals
          </h3>
          <p>
            Create a professional profile, showcase your experience, highlight
            your services, and make it easier for businesses to discover and
            contact you.
          </p>
        </div>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">Our Mission</h2>
        <p>Our mission is simple:</p>
        <p className="text-lg font-semibold text-secondary">
          To make AI talent more accessible.
        </p>
        <p>
          We believe businesses of every size should be able to find the
          expertise they need, and AI professionals should have a
          straightforward way to showcase their skills and connect with new
          opportunities.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          Growing With the Industry
        </h2>
        <p>
          Artificial intelligence is transforming almost every industry. As the
          market evolves, so will AIJobsMarket.
        </p>
        <p>
          We&apos;re continuously improving the platform, expanding our features,
          and building new tools that help people discover opportunities, build
          careers, and connect with AI expertise.
        </p>
        <p>
          Our aim is to become a trusted destination for anyone looking to work
          in AI, hire AI professionals, or stay connected with the future of
          artificial intelligence.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">Get Started</h2>
        <p>
          Whether you&apos;re searching for your next AI role, looking to hire an
          AI expert, or simply exploring what&apos;s happening in the AI
          industry, AIJobsMarket is here to help.
        </p>
        <p className="font-medium text-secondary">Welcome to AIJobsMarket.</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/search"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Browse AI experts
          </Link>
          <Link
            href="/jobs.html"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary hover:bg-surface"
          >
            Browse AI jobs
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
