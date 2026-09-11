import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How AI Task Pages collects, uses, stores and protects your personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-secondary">
        AI Task Pages Privacy Policy
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
          Welcome to AI Task Pages (&quot;AI Task Pages&quot;, &quot;we&quot;,
          &quot;our&quot; or &quot;us&quot;).
        </p>
        <p>
          Your privacy is important to us. This Privacy Policy explains how we
          collect, use, store and protect your personal information when you use
          our website and services.
        </p>
        <p>
          AI Task Pages is committed to complying with applicable UK data
          protection legislation, including the UK General Data Protection
          Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>
        <p>
          By using AI Task Pages, you agree to the practices described in this
          Privacy Policy.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          2. About AI Task Pages
        </h2>
        <p>
          AI Task Pages is an online platform that helps users discover
          opportunities within the Artificial Intelligence industry.
        </p>
        <p>Our services may include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>AI job listings</li>
          <li>AI Expert Directory</li>
          <li>AI software and tools directory</li>
          <li>Business requirement listings</li>
          <li>Company profiles</li>
          <li>Career resources</li>
          <li>Future premium services</li>
        </ul>
        <p>
          Some job listings displayed on AI Task Pages are provided through
          trusted third-party partners.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          3. Information We Collect
        </h2>
        <p>
          Depending on how you use AI Task Pages, we may collect different
          categories of information.
        </p>

        <h3 className="text-lg font-semibold text-secondary">
          Information you provide
        </h3>
        <p>You may provide information when you:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>create an account</li>
          <li>complete your profile</li>
          <li>submit an enquiry</li>
          <li>contact us</li>
          <li>apply to become an AI Expert</li>
          <li>submit feedback</li>
          <li>report a problem</li>
        </ul>
        <p>This information may include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Name</li>
          <li>Email address</li>
          <li>Company name</li>
          <li>Job title</li>
          <li>Biography</li>
          <li>Skills</li>
          <li>Profile photograph</li>
          <li>Website</li>
          <li>LinkedIn profile</li>
          <li>Social media links</li>
          <li>Any information you choose to provide.</li>
        </ul>

        <h3 className="pt-4 text-lg font-semibold text-secondary">
          Information collected automatically
        </h3>
        <p>
          When you visit AI Task Pages, certain technical information may be
          collected automatically.
        </p>
        <p>Examples include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>IP address</li>
          <li>Browser type</li>
          <li>Device type</li>
          <li>Operating system</li>
          <li>Pages visited</li>
          <li>Search queries</li>
          <li>Referring website</li>
          <li>Time spent on pages</li>
          <li>Date and time of access</li>
        </ul>
        <p>
          This information helps us improve the platform and identify technical
          issues.
        </p>

        <h3 className="pt-4 text-lg font-semibold text-secondary">Cookies</h3>
        <p>AI Task Pages uses cookies and similar technologies.</p>
        <p>Cookies help us:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>remember user preferences</li>
          <li>keep users signed in</li>
          <li>improve website performance</li>
          <li>understand how visitors use the platform</li>
        </ul>
        <p>
          More information can be found in our{" "}
          <Link href="/cookies" className="text-primary underline">
            Cookie Policy
          </Link>
          .
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          4. How We Use Your Information
        </h2>
        <p>We use personal information to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>provide our services</li>
          <li>create user accounts</li>
          <li>authenticate users</li>
          <li>manage AI Expert profiles</li>
          <li>respond to enquiries</li>
          <li>improve the platform</li>
          <li>detect fraud and abuse</li>
          <li>maintain platform security</li>
          <li>comply with legal obligations</li>
          <li>communicate important service updates</li>
        </ul>
        <p>We do not sell personal information.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          5. Legal Basis for Processing
        </h2>
        <p>
          Where UK GDPR applies, we process personal information using one or
          more of the following legal bases:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Your consent</li>
          <li>Performance of a contract</li>
          <li>Compliance with legal obligations</li>
          <li>Legitimate business interests</li>
        </ul>
        <p>
          Where consent is required, you may withdraw that consent at any time.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          6. Authentication
        </h2>
        <p>AI Task Pages uses Clerk for user authentication.</p>
        <p>
          If you choose to sign in using services such as Google, GitHub, or
          LinkedIn, those providers may share limited account information with
          AI Task Pages, such as:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Name</li>
          <li>Email address</li>
          <li>Profile image</li>
        </ul>
        <p>
          The information shared depends on the permissions granted by you
          during sign in.
        </p>
        <p>
          Please review the privacy policies of those providers for additional
          information.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          7. Third-Party Services
        </h2>
        <p>
          AI Task Pages relies on trusted third-party providers to deliver parts
          of the service.
        </p>
        <p>These providers may process information on our behalf.</p>
        <p>Examples may include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Clerk (authentication)</li>
          <li>Cloudflare (hosting)</li>
          <li>Cloudflare D1 (database)</li>
          <li>Cloudflare R2 (file storage)</li>
          <li>Email service providers</li>
          <li>Analytics providers</li>
        </ul>
        <p>
          Each provider processes data according to its own privacy policy.
        </p>
        <p>
          AI Task Pages selects providers that are appropriate for the services
          they perform.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          8. Job Listings
        </h2>
        <p>
          Some job listings displayed on AI Task Pages originate from third-party
          job providers.
        </p>
        <p>
          When you choose to apply for a job, you may be redirected to the
          original provider&apos;s website.
        </p>
        <p>
          Once you leave AI Task Pages, your interaction is governed by that
          provider&apos;s own terms and privacy policy.
        </p>
        <p>
          AI Task Pages is not responsible for how third-party websites process
          your information.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          9. AI Expert Profiles
        </h2>
        <p>
          If you create an AI Expert profile, the information you choose to
          publish may become publicly visible.
        </p>
        <p>Examples include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Name</li>
          <li>Biography</li>
          <li>Skills</li>
          <li>Services</li>
          <li>Website</li>
          <li>LinkedIn profile</li>
          <li>Portfolio</li>
          <li>Company</li>
          <li>Public contact information</li>
        </ul>
        <p>
          Only publish information that you are comfortable making publicly
          available.
        </p>
        <p>You remain responsible for the accuracy of your profile.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          10. Data Security
        </h2>
        <p>
          AI Task Pages takes reasonable technical and organisational measures to
          protect personal information.
        </p>
        <p>These measures may include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Encrypted connections (HTTPS)</li>
          <li>Secure authentication</li>
          <li>Access controls</li>
          <li>Regular software updates</li>
          <li>Monitoring for suspicious activity</li>
        </ul>
        <p>No internet-based service can guarantee absolute security.</p>
        <p>
          Users should also take reasonable precautions to protect their own
          accounts.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          11. Data Retention
        </h2>
        <p>We retain personal information only for as long as necessary to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>provide our services</li>
          <li>comply with legal obligations</li>
          <li>resolve disputes</li>
          <li>enforce our agreements</li>
        </ul>
        <p>
          When information is no longer required, it will be securely deleted
          or anonymised where appropriate.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          12. Your Rights
        </h2>
        <p>Depending on applicable law, you may have the right to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>access your personal information</li>
          <li>correct inaccurate information</li>
          <li>request deletion</li>
          <li>object to processing</li>
          <li>restrict processing</li>
          <li>request data portability</li>
          <li>withdraw consent</li>
        </ul>
        <p>
          Requests should be submitted using the contact details provided
          below.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          13. Children&apos;s Privacy
        </h2>
        <p>AI Task Pages is intended for users aged 18 years or older.</p>
        <p>We do not knowingly collect personal information from children.</p>
        <p>
          If we become aware that personal information relating to a child has
          been collected, we will take reasonable steps to remove it.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          14. Changes to this Policy
        </h2>
        <p>We may update this Privacy Policy from time to time.</p>
        <p>
          When significant changes are made, we will update the &quot;Last
          Updated&quot; date at the top of this document.
        </p>
        <p>
          Continued use of AI Task Pages after changes have been published
          constitutes acceptance of the updated policy.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">15. Contact</h2>
        <p>
          If you have questions regarding this Privacy Policy, please contact:
        </p>
        <p className="font-medium">AI Task Pages</p>
        <p>
          Website:{" "}
          <a
            href="https://aitaskpages.com"
            className="text-primary underline"
          >
            https://aitaskpages.com
          </a>
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:privacy@aitaskpages.com"
            className="text-primary underline"
          >
            privacy@aitaskpages.com
          </a>
        </p>
      </section>

      <hr className="my-10 border-border" />

      <p className="text-sm text-muted">
        <strong>Version 1.0</strong>
      </p>
      <p className="mt-2 text-sm text-muted">
        This Privacy Policy applies to the AI Task Pages platform as of the
        effective date shown above and may be updated as the platform evolves.
      </p>
    </article>
  );
}
