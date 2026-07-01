import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Terms of Service governing your use of the AIJobsMarket website and platform.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-secondary">
        AIJobsMarket Terms of Service
      </h1>
      <p className="mt-3 text-sm text-muted">
        <strong>Effective Date:</strong> July 2026
        <br />
        <strong>Last Updated:</strong> July 2026
      </p>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">1. Introduction</h2>
        <p>
          Welcome to AIJobsMarket (&quot;AIJobsMarket&quot;, &quot;we&quot;,
          &quot;our&quot; or &quot;us&quot;).
        </p>
        <p>
          These Terms of Service govern your access to and use of the
          AIJobsMarket website and any related services we provide.
        </p>
        <p>
          By accessing or using AIJobsMarket, you agree to be bound by these
          Terms.
        </p>
        <p>
          If you do not agree with these Terms, you should not use our platform.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          2. About AIJobsMarket
        </h2>
        <p>
          AIJobsMarket is an online platform designed to help users discover
          opportunities within the Artificial Intelligence industry.
        </p>
        <p>The platform may include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>AI job listings</li>
          <li>AI Expert Directory</li>
          <li>AI software and tool directory</li>
          <li>Company profiles</li>
          <li>Business requirement listings</li>
          <li>Career resources</li>
          <li>Future premium services</li>
        </ul>
        <p>We may add, remove or modify features at any time.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">3. Eligibility</h2>
        <p>You must be at least 18 years old to create an account.</p>
        <p>By creating an account you confirm that:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>the information you provide is accurate;</li>
          <li>you have the legal capacity to enter into these Terms;</li>
          <li>you will keep your account information up to date.</li>
        </ul>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          4. User Accounts
        </h2>
        <p>Some features require an account.</p>
        <p>You are responsible for:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>maintaining the security of your account;</li>
          <li>protecting your password;</li>
          <li>all activity carried out using your account.</li>
        </ul>
        <p>
          You must notify us immediately if you believe your account has been
          compromised.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          5. AI Expert Profiles
        </h2>
        <p>Users may create public AI Expert profiles.</p>
        <p>By publishing a profile you confirm that:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>the information is accurate;</li>
          <li>you own or have permission to use any content you upload;</li>
          <li>you will keep your profile reasonably up to date.</li>
        </ul>
        <p>You remain solely responsible for the content of your profile.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          6. Job Listings
        </h2>
        <p>
          AIJobsMarket may display job listings provided by third parties.
        </p>
        <p>Unless stated otherwise:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>AIJobsMarket is not the employer.</li>
          <li>AIJobsMarket does not guarantee that a vacancy remains available.</li>
          <li>AIJobsMarket is not responsible for recruitment decisions.</li>
        </ul>
        <p>
          Applications submitted through third-party websites are governed by
          the policies of those websites.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          7. Acceptable Use
        </h2>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>publish false information;</li>
          <li>impersonate another person;</li>
          <li>upload malicious software;</li>
          <li>attempt to gain unauthorised access;</li>
          <li>scrape or harvest data without permission;</li>
          <li>interfere with the operation of the platform;</li>
          <li>use the platform for unlawful purposes.</li>
        </ul>
        <p>
          Accounts that violate these Terms may be suspended or permanently
          removed.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          8. Intellectual Property
        </h2>
        <p>
          Unless otherwise stated, all intellectual property relating to
          AIJobsMarket, including:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>branding;</li>
          <li>logos;</li>
          <li>design;</li>
          <li>software;</li>
          <li>text;</li>
          <li>graphics;</li>
          <li>databases;</li>
        </ul>
        <p>belongs to AIJobsMarket or its licensors.</p>
        <p>
          You may not reproduce, distribute or commercially exploit our content
          without permission.
        </p>
        <p>
          Users retain ownership of content they upload, but grant AIJobsMarket
          a non-exclusive licence to display and use that content for operating
          the platform.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          9. Third-Party Services
        </h2>
        <p>
          AIJobsMarket may integrate with third-party providers including
          authentication services, hosting providers and job listing partners.
        </p>
        <p>
          We are not responsible for the availability, content or policies of
          third-party websites or services.
        </p>
        <p>Your use of those services is governed by their own terms.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          10. Limitation of Liability
        </h2>
        <p>
          AIJobsMarket is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis.
        </p>
        <p>While we aim to provide accurate information, we do not guarantee:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>completeness;</li>
          <li>accuracy;</li>
          <li>availability;</li>
          <li>uninterrupted service.</li>
        </ul>
        <p>
          To the fullest extent permitted by law, AIJobsMarket excludes liability
          for indirect or consequential losses arising from your use of the
          platform.
        </p>
        <p>
          Nothing in these Terms excludes liability that cannot legally be
          excluded.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          11. Suspension and Termination
        </h2>
        <p>We reserve the right to suspend or terminate accounts that:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>breach these Terms;</li>
          <li>abuse the platform;</li>
          <li>engage in fraudulent activity;</li>
          <li>threaten the security or integrity of AIJobsMarket.</li>
        </ul>
        <p>Where appropriate, we may remove content without prior notice.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          12. Changes to the Platform
        </h2>
        <p>AIJobsMarket is continually evolving.</p>
        <p>We may:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>introduce new features;</li>
          <li>remove existing features;</li>
          <li>modify functionality;</li>
          <li>discontinue parts of the platform.</li>
        </ul>
        <p>
          We are under no obligation to maintain any specific feature
          indefinitely.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          13. Changes to these Terms
        </h2>
        <p>We may update these Terms from time to time.</p>
        <p>The latest version will always be published on AIJobsMarket.</p>
        <p>
          Your continued use of the platform after changes have been published
          constitutes acceptance of the updated Terms.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          14. Governing Law
        </h2>
        <p>These Terms are governed by the laws of England and Wales.</p>
        <p>
          Any disputes arising from these Terms shall be subject to the
          exclusive jurisdiction of the courts of England and Wales unless
          applicable law provides otherwise.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">15. Contact</h2>
        <p>
          If you have any questions regarding these Terms, please contact:
        </p>
        <p className="font-medium">AIJobsMarket</p>
        <p>
          Website:{" "}
          <a
            href="https://aijobsmarket.co.uk"
            className="text-primary underline"
          >
            https://aijobsmarket.co.uk
          </a>
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:legal@aijobsmarket.co.uk"
            className="text-primary underline"
          >
            legal@aijobsmarket.co.uk
          </a>
        </p>
      </section>

      <hr className="my-10 border-border" />

      <p className="text-sm text-muted">
        <strong>Version 1.0</strong>
      </p>
      <p className="mt-2 text-sm text-muted">
        These Terms of Service apply to all users of AIJobsMarket unless replaced
        by a future version.
      </p>
    </article>
  );
}
