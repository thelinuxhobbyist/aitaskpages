import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact AI Jobs Market for questions about expert profiles, posting a task, or using the platform. General and legal enquiry emails.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-secondary">
        Contact {SITE_NAME}
      </h1>

      <p className="mt-6 text-lg font-medium leading-relaxed text-secondary">
        Have a question about {SITE_NAME}, an expert profile, posting a task,
        or using the platform?
      </p>
      <p className="mt-4">We&apos;d be happy to hear from you.</p>

      <hr className="my-10 border-border" />

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-secondary">Get in touch</h2>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-secondary">
            General enquiries
          </h3>
          <p>
            <a
              href="mailto:contact@aijobsmarket.co.uk"
              className="font-medium text-primary underline"
            >
              contact@aijobsmarket.co.uk
            </a>
          </p>
          <p>
            For questions about the platform, expert profiles, tasks,
            partnerships, or general support, please email us and we&apos;ll
            get back to you as soon as possible.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-secondary">
            Legal enquiries
          </h3>
          <p>
            <a
              href="mailto:legal@aijobsmarket.co.uk"
              className="font-medium text-primary underline"
            >
              legal@aijobsmarket.co.uk
            </a>
          </p>
          <p>
            For legal, privacy, terms, copyright, or other formal matters,
            please contact our legal team.
          </p>
        </div>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          Before contacting us
        </h2>
        <p>
          {SITE_NAME} is an AI expert directory and business-to-expert
          introduction platform.
        </p>
        <p>
          We provide a place where businesses can discover AI professionals and
          where independent AI professionals can make themselves visible to
          potential clients.
        </p>
        <p>
          {SITE_NAME} does not act as an employment agency, recruitment
          business, staffing company, escrow service, payment processor, or
          intermediary in any agreement between businesses and AI
          professionals.
        </p>
        <p>
          Our role is simply to provide the platform for discovery and initial
          contact. What happens after an introduction is entirely between the
          relevant parties.
        </p>
        <p>
          If you&apos;re a business, you can{" "}
          <Link href="/search" className="text-primary underline">
            Browse Experts
          </Link>{" "}
          or{" "}
          <Link
            href="/tasks/new"
            className="text-primary underline"
          >
            Post a Task
          </Link>{" "}
          to make your requirements visible to AI professionals.
        </p>
        <p>
          If you&apos;re an AI professional, you can{" "}
          <Link href="/join-as-expert" className="text-primary underline">
            Join as an Expert
          </Link>{" "}
          and create a public profile.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">Useful links</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Link href="/search" className="text-primary underline">
              Browse AI Experts
            </Link>
          </li>
          <li>
            <Link href="/tasks" className="text-primary underline">
              Browse AI Tasks
            </Link>
          </li>
          <li>
            <Link
              href="/tasks/new"
              className="text-primary underline"
            >
              Post a Task
            </Link>
          </li>
          <li>
            <Link href="/join-as-expert" className="text-primary underline">
              Join as an Expert
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-primary underline">
              About {SITE_NAME}
            </Link>
          </li>
          <li>
            <Link href="/terms" className="text-primary underline">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/cookies" className="text-primary underline">
              Cookie Policy
            </Link>
          </li>
          <li>
            <Link href="/disclaimer" className="text-primary underline">
              Disclaimer
            </Link>
          </li>
          <li>
            <Link href="/acceptable-use" className="text-primary underline">
              Acceptable Use Policy
            </Link>
          </li>
          <li>
            <Link href="/expert-terms" className="text-primary underline">
              AI Expert Terms
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}
