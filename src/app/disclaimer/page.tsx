import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Disclaimer",
  description:
    "Disclaimer for the AI Task Pages platform — general information, job listings, and AI Expert profiles.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-secondary">
        AI Task Pages Disclaimer
      </h1>
      <p className="mt-3 text-sm text-muted">
        <strong>Effective Date:</strong> July 2026
        <br />
        <strong>Last Updated:</strong> July 2026
      </p>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          1. General Information
        </h2>
        <p>
          The information provided on AI Task Pages (&quot;AI Task Pages&quot;,
          &quot;we&quot;, &quot;our&quot; or &quot;us&quot;) is for general
          informational purposes only.
        </p>
        <p>
          While we aim to provide accurate, up-to-date and useful information,
          we make no guarantees or warranties regarding the completeness,
          accuracy, reliability or availability of any information published on
          the platform.
        </p>
        <p>Your use of AI Task Pages is entirely at your own risk.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          2. No Employment Guarantee
        </h2>
        <p>
          AI Task Pages helps users discover AI experts and project requirements within the Artificial
          Intelligence industry.
        </p>
        <p>We do not guarantee:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>that you will receive a job offer;</li>
          <li>that an employer will respond;</li>
          <li>that a vacancy remains open;</li>
          <li>that an application will be successful.</li>
        </ul>
        <p>Employment decisions are made solely by employers.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          3. Third-Party Job Listings
        </h2>
        <p>
          Some jobs displayed on AI Task Pages originate from third-party
          providers.
        </p>
        <p>AI Task Pages:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>is not the employer;</li>
          <li>does not create those job advertisements;</li>
          <li>does not guarantee their accuracy;</li>
          <li>cannot guarantee that vacancies remain available.</li>
        </ul>
        <p>
          Before applying for any position, you should verify the information
          directly with the employer or job provider.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          4. AI Expert Directory
        </h2>
        <p>
          AI Expert profiles are created and managed by the individuals or
          organisations that publish them.
        </p>
        <p>AI Task Pages does not independently verify:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>qualifications;</li>
          <li>experience;</li>
          <li>certifications;</li>
          <li>references;</li>
          <li>services offered.</li>
        </ul>
        <p>
          Users should carry out their own due diligence before hiring,
          engaging or entering into any agreement with an AI Expert.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          5. External Websites
        </h2>
        <p>AI Task Pages may contain links to third-party websites.</p>
        <p>These links are provided for convenience only.</p>
        <p>We do not control or endorse third-party websites and are not responsible for:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>their content;</li>
          <li>their privacy practices;</li>
          <li>their availability;</li>
          <li>their products or services.</li>
        </ul>
        <p>Accessing third-party websites is at your own risk.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          6. Business Decisions
        </h2>
        <p>Information published on AI Task Pages should not be considered:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>legal advice;</li>
          <li>financial advice;</li>
          <li>investment advice;</li>
          <li>recruitment advice;</li>
          <li>business consultancy.</li>
        </ul>
        <p>
          Users should seek appropriate professional advice before making
          important business or legal decisions.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          7. Availability
        </h2>
        <p>
          Although we aim to provide a reliable service, AI Task Pages does not
          guarantee uninterrupted availability.
        </p>
        <p>The platform may occasionally be unavailable due to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>maintenance;</li>
          <li>software updates;</li>
          <li>technical issues;</li>
          <li>security incidents;</li>
          <li>circumstances beyond our reasonable control.</li>
        </ul>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          8. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, AI Task Pages shall not be
          liable for any direct, indirect, incidental or consequential loss
          arising from:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>use of the platform;</li>
          <li>reliance on published information;</li>
          <li>recruitment decisions;</li>
          <li>hiring decisions;</li>
          <li>interactions with third parties;</li>
          <li>temporary service interruptions.</li>
        </ul>
        <p>
          Nothing in this Disclaimer excludes liability that cannot legally be
          excluded under applicable law.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">9. Changes</h2>
        <p>We may update this Disclaimer at any time.</p>
        <p>The latest version will always be available on AI Task Pages.</p>
        <p>
          Continued use of the platform constitutes acceptance of any updated
          version.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">10. Contact</h2>
        <p>
          If you have any questions regarding this Disclaimer, please contact:
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
        This Disclaimer should be read together with the{" "}
        <Link href="/privacy" className="text-primary underline">
          Privacy Policy
        </Link>
        ,{" "}
        <Link href="/terms" className="text-primary underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/cookies" className="text-primary underline">
          Cookie Policy
        </Link>
        .
      </p>
    </article>
  );
}
