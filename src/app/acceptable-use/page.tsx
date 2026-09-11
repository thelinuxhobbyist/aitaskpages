import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Acceptable Use Policy",
  description:
    "Rules for using the AI Task Pages platform responsibly and professionally.",
  path: "/acceptable-use",
});

export default function AcceptableUsePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-secondary">
        AI Task Pages Acceptable Use Policy
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
          This Acceptable Use Policy explains the rules that apply when using
          AI Task Pages (&quot;AI Task Pages&quot;, &quot;we&quot;, &quot;our&quot;
          or &quot;us&quot;).
        </p>
        <p>
          The purpose of this policy is to help maintain a professional, safe and
          trustworthy platform for all users.
        </p>
        <p>By using AI Task Pages, you agree to comply with this policy.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          2. Respectful Use
        </h2>
        <p>You agree to use AI Task Pages responsibly and respectfully.</p>
        <p>You must not use the platform in any way that:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>is unlawful;</li>
          <li>is fraudulent;</li>
          <li>is misleading;</li>
          <li>is abusive;</li>
          <li>is harmful to other users.</li>
        </ul>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">3. User Content</h2>
        <p>You are responsible for all content you publish on AI Task Pages.</p>
        <p>This includes:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>AI Expert profiles</li>
          <li>Company information</li>
          <li>Portfolio links</li>
          <li>Images</li>
          <li>Comments (if introduced)</li>
          <li>Business requirement listings</li>
          <li>Any other submitted content</li>
        </ul>
        <p>
          You must ensure your content is accurate and that you have the right
          to publish it.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          4. Prohibited Content
        </h2>
        <p>You must not publish content that:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>is false or misleading;</li>
          <li>infringes intellectual property rights;</li>
          <li>contains malware or malicious code;</li>
          <li>promotes illegal activity;</li>
          <li>contains spam;</li>
          <li>contains hate speech or discriminatory content;</li>
          <li>contains obscene or offensive material;</li>
          <li>impersonates another person or organisation.</li>
        </ul>
        <p>
          AI Task Pages reserves the right to remove content that violates this
          policy.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          5. Fake Profiles
        </h2>
        <p>Creating fake or misleading profiles is prohibited.</p>
        <p>This includes:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>pretending to represent another person;</li>
          <li>pretending to represent a company;</li>
          <li>creating multiple deceptive accounts;</li>
          <li>publishing false qualifications or experience.</li>
        </ul>
        <p>Accounts found to be fraudulent may be permanently removed.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          6. Platform Security
        </h2>
        <p>You must not attempt to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>gain unauthorised access to the platform;</li>
          <li>interfere with platform security;</li>
          <li>test security without permission;</li>
          <li>upload malicious software;</li>
          <li>disrupt the operation of AI Task Pages.</li>
        </ul>
        <p>
          Any attempt to compromise platform security may result in immediate
          account suspension and, where appropriate, legal action.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          7. Automated Access
        </h2>
        <p>Unless expressly authorised in writing, you must not:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>scrape the website;</li>
          <li>harvest email addresses;</li>
          <li>use automated bots to collect data;</li>
          <li>overload the platform with automated requests.</li>
        </ul>
        <p>Reasonable search engine indexing is permitted.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          8. AI Expert Profiles
        </h2>
        <p>AI Experts should:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>provide accurate information;</li>
          <li>keep profiles up to date;</li>
          <li>respond professionally to enquiries;</li>
          <li>avoid misleading claims;</li>
          <li>accurately represent qualifications and experience.</li>
        </ul>
        <p>
          AI Task Pages may remove profiles that consistently contain inaccurate
          or misleading information.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">9. Enforcement</h2>
        <p>Where this policy is breached, AI Task Pages may:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>remove content;</li>
          <li>suspend accounts;</li>
          <li>permanently ban users;</li>
          <li>restrict platform access;</li>
          <li>
            report unlawful activity to the relevant authorities where required.
          </li>
        </ul>
        <p>
          We reserve the right to take action without prior notice where
          necessary to protect the platform or its users.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          10. Changes to this Policy
        </h2>
        <p>This policy may be updated from time to time.</p>
        <p>The latest version will always be published on AI Task Pages.</p>
        <p>
          Continued use of the platform constitutes acceptance of the updated
          policy.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">11. Contact</h2>
        <p>
          If you have questions regarding this Acceptable Use Policy, please
          contact:
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
            href="mailto:legal@aitaskpages.com"
            className="text-primary underline"
          >
            legal@aitaskpages.com
          </a>
        </p>
      </section>

      <hr className="my-10 border-border" />

      <p className="text-sm text-muted">
        <strong>Version 1.0</strong>
      </p>
      <p className="mt-2 text-sm text-muted">
        This Acceptable Use Policy should be read alongside the{" "}
        <Link href="/privacy" className="text-primary underline">
          Privacy Policy
        </Link>
        ,{" "}
        <Link href="/terms" className="text-primary underline">
          Terms of Service
        </Link>{" "}
        and other legal documents published by AI Task Pages.
      </p>
    </article>
  );
}
