import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | AI Jobs Market",
  description:
    "How AI Jobs Market collects, uses and protects your personal data.",
};

export default function PrivacyPage() {
  const updated = "27 June 2026";

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 prose prose-neutral">
      <h1 className="text-3xl font-bold text-secondary">Privacy Policy</h1>
      <p className="text-sm text-muted">Last updated: {updated}</p>

      <p className="mt-6 text-on-surface">
        AI Jobs Market (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates{" "}
        <a href="https://aijobsmarket.co.uk">aijobsmarket.co.uk</a>, an AI
        expert directory and jobs board. This policy explains how we handle your
        personal data when you use our website.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-secondary">
        Who is responsible for your data?
      </h2>
      <p>
        AI Jobs Market is the data controller for personal data processed
        through this website. Contact:{" "}
        <a href="mailto:contact@aijobsmarket.co.uk">
          contact@aijobsmarket.co.uk
        </a>
        .
      </p>

      <h2 className="mt-10 text-xl font-semibold text-secondary">
        What data we collect
      </h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Account data</strong> — email address, name, and sign-in
          details when you create an account (handled by our authentication
          provider, Clerk).
        </li>
        <li>
          <strong>Expert profile data</strong> — if you create a public expert
          profile: display name, headline, bio, location, rates, skills,
          services, links, and profile photo.
        </li>
        <li>
          <strong>Messages</strong> — content you send through our on-platform
          conversation system when contacting an expert or replying to a client.
        </li>
        <li>
          <strong>Marketing preferences</strong> — whether you have opted in to
          product updates and marketing emails.
        </li>
        <li>
          <strong>Technical data</strong> — IP address and browser information
          may be processed by our hosting and security providers (e.g. bot
          protection).
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-secondary">
        How we use your data
      </h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>To provide your account and the directory service (contract).</li>
        <li>
          To display public expert profiles to visitors (contract / legitimate
          interest).
        </li>
        <li>
          To deliver on-platform messaging between clients and experts
          (contract).
        </li>
        <li>
          To send transactional emails about your account and messages, e.g.
          new message notifications (contract).
        </li>
        <li>
          To send marketing emails only where you have opted in (consent). You
          can unsubscribe at any time.
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-secondary">
        Where your data is stored
      </h2>
      <p>
        Application data (profiles, messages, preferences) is stored in a
        Cloudflare D1 database. Profile images are stored in Cloudflare R2.
        Authentication data is stored by Clerk. Email is sent via Resend.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-secondary">
        Third-party processors
      </h2>
      <p>We use the following service providers to run the platform:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Clerk</strong> — user authentication and account management (
          <a
            href="https://clerk.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Clerk Privacy Policy
          </a>
          ).
        </li>
        <li>
          <strong>Cloudflare</strong> — website hosting, database (D1), image
          storage (R2), and optional bot protection (
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare Privacy Policy
          </a>
          ).
        </li>
        <li>
          <strong>Resend</strong> — transactional and marketing email delivery
          (
          <a
            href="https://resend.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resend Privacy Policy
          </a>
          ).
        </li>
      </ul>
      <p>
        These providers process data on our behalf under their own terms and
        privacy policies. We do not sell your personal data.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-secondary">
        Public expert profiles
      </h2>
      <p>
        Information you add to your expert profile (name, bio, skills, location,
        etc.) is <strong>public</strong> and visible to anyone visiting the
        directory. Do not include information you do not want to be public.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-secondary">
        How long we keep data
      </h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Account and profile data — while your account is active.
        </li>
        <li>
          Messages — retained so the other party in a conversation can access
          their history, including after an account is deleted (the deleted
          account is anonymised).
        </li>
        <li>
          Marketing send logs — up to 24 months, then reviewed for deletion.
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-secondary">
        Your rights (UK GDPR)
      </h2>
      <p>You have the right to:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Access the personal data we hold about you.</li>
        <li>Correct inaccurate data (via your account or by contacting us).</li>
        <li>
          Request erasure — delete your account through Clerk; we anonymise your
          D1 record via our deletion process.
        </li>
        <li>Withdraw marketing consent at any time (unsubscribe link or Account settings).</li>
        <li>Object to processing or request restriction in certain cases.</li>
        <li>Lodge a complaint with the ICO (ico.org.uk).</li>
      </ul>
      <p>
        To exercise your rights, email{" "}
        <a href="mailto:contact@aijobsmarket.co.uk">
          contact@aijobsmarket.co.uk
        </a>
        .
      </p>

      <h2 className="mt-10 text-xl font-semibold text-secondary">
        Account deletion
      </h2>
      <p>
        When you delete your Clerk account, we receive a webhook and anonymise
        your record in our database: your email and name are replaced, your
        expert profile is removed from the public directory, and marketing emails
        stop. Conversation history may be retained in anonymised form for the
        other party.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-secondary">
        Cookies
      </h2>
      <p>
        We use essential cookies for authentication and session management.
        See our{" "}
        <Link href="/cookies" className="text-primary underline">
          Cookie Policy
        </Link>{" "}
        for details.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-secondary">
        Changes to this policy
      </h2>
      <p>
        We may update this policy from time to time. The &quot;Last updated&quot;
        date at the top will change when we do.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-secondary">Contact</h2>
      <p>
        Questions about this policy:{" "}
        <a href="mailto:contact@aijobsmarket.co.uk">
          contact@aijobsmarket.co.uk
        </a>
      </p>
    </article>
  );
}
