import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "AI Expert Terms",
  description:
    "Terms that apply to users who create or publish an AI Expert profile on AI Task Pages.",
  path: "/expert-terms",
});

export default function ExpertTermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-secondary">
        AI Task Pages AI Expert Terms
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
          These AI Expert Terms apply to all users who create, manage or publish
          an AI Expert profile on AI Task Pages (&quot;AI Task Pages&quot;,
          &quot;we&quot;, &quot;our&quot; or &quot;us&quot;).
        </p>
        <p>
          These terms are in addition to our Privacy Policy, Terms of Service,
          Cookie Policy and Acceptable Use Policy.
        </p>
        <p>By creating an AI Expert profile, you agree to these Terms.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          2. Purpose of the AI Expert Directory
        </h2>
        <p>
          The AI Expert Directory exists to help businesses discover
          professionals who provide Artificial Intelligence related services.
        </p>
        <p>
          AI Task Pages provides a platform for discovery and initial contact
          only.
        </p>
        <p>AI Task Pages is <strong>not</strong>:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>an employment agency;</li>
          <li>a recruitment business;</li>
          <li>a staffing company;</li>
          <li>an escrow service;</li>
          <li>a payment processor.</li>
        </ul>
        <p>
          Any agreement between an AI Expert and a client is made directly
          between those parties.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">3. Eligibility</h2>
        <p>To create an AI Expert profile you must:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>be at least 18 years old;</li>
          <li>provide accurate information;</li>
          <li>have the legal right to offer the services described;</li>
          <li>comply with all applicable laws.</li>
        </ul>
        <p>
          AI Task Pages may request additional information where necessary to
          maintain platform integrity.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">4. Your Profile</h2>
        <p>
          You are responsible for ensuring your profile remains accurate and up
          to date.
        </p>
        <p>Your profile may include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Name</li>
          <li>Company</li>
          <li>Biography</li>
          <li>Skills</li>
          <li>Services</li>
          <li>Experience</li>
          <li>Website</li>
          <li>Portfolio</li>
          <li>Social media links</li>
          <li>Location</li>
          <li>Contact information</li>
        </ul>
        <p>You must not knowingly publish false or misleading information.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          5. Accuracy of Information
        </h2>
        <p>By publishing an AI Expert profile you confirm that:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>your qualifications are accurate;</li>
          <li>your experience is truthful;</li>
          <li>
            your portfolio represents your own work or work you have permission
            to display;
          </li>
          <li>your services are described honestly.</li>
        </ul>
        <p>
          Providing false information may result in suspension or permanent
          removal of your profile.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          6. Ownership of Content
        </h2>
        <p>You retain ownership of the content you upload.</p>
        <p>
          However, by publishing your profile you grant AI Task Pages a
          worldwide, non-exclusive, royalty-free licence to:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>display your profile;</li>
          <li>
            reproduce your content as required to operate the platform;
          </li>
          <li>promote your public profile within AI Task Pages.</li>
        </ul>
        <p>
          This licence ends when your content is removed from the platform,
          except where copies must be retained for legal or operational reasons.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">7. Enquiries</h2>
        <p>
          Businesses may contact you using the contact methods you choose to
          publish.
        </p>
        <p>AI Task Pages does not:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>participate in negotiations;</li>
          <li>review contracts;</li>
          <li>process payments;</li>
          <li>guarantee enquiries.</li>
        </ul>
        <p>
          You are solely responsible for any communication and agreements made
          with clients.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">8. Fees</h2>
        <p>
          Creating an AI Expert profile may be free or paid, depending on the
          services offered by AI Task Pages.
        </p>
        <p>
          Where paid services are introduced in the future, separate pricing
          and subscription terms will apply.
        </p>
        <p>
          Unless expressly stated otherwise, publishing a profile does not
          guarantee enquiries, projects or revenue.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">9. Verification</h2>
        <p>
          AI Task Pages may introduce profile verification in the future.
        </p>
        <p>
          Verification indicates only that certain information has been checked
          according to our verification process.
        </p>
        <p>Verification does <strong>not</strong>:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>guarantee competence;</li>
          <li>guarantee qualifications;</li>
          <li>recommend an expert;</li>
          <li>guarantee future performance.</li>
        </ul>
        <p>
          Businesses should always carry out their own due diligence before
          engaging an AI Expert.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          10. Removal of Profiles
        </h2>
        <p>AI Task Pages reserves the right to suspend or remove profiles that:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>breach our Terms;</li>
          <li>contain false information;</li>
          <li>infringe intellectual property rights;</li>
          <li>violate applicable law;</li>
          <li>damage the integrity of the platform.</li>
        </ul>
        <p>
          Where appropriate, we may request corrections before removing a
          profile.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          11. Limitation of Liability
        </h2>
        <p>AI Task Pages acts solely as a discovery platform.</p>
        <p>We do not guarantee:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>the accuracy of profile information;</li>
          <li>the outcome of projects;</li>
          <li>the quality of services;</li>
          <li>the suitability of any AI Expert.</li>
        </ul>
        <p>
          Any agreement between a client and an AI Expert is entered into
          entirely at their own risk.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          12. Changes to these Terms
        </h2>
        <p>These AI Expert Terms may be updated from time to time.</p>
        <p>The latest version will always be published on AI Task Pages.</p>
        <p>
          Continued use of the AI Expert Directory after changes have been
          published constitutes acceptance of the updated Terms.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">13. Contact</h2>
        <p>
          If you have questions regarding these AI Expert Terms, please contact:
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
        These AI Expert Terms should be read together with the{" "}
        <Link href="/privacy" className="text-primary underline">
          Privacy Policy
        </Link>
        ,{" "}
        <Link href="/terms" className="text-primary underline">
          Terms of Service
        </Link>
        ,{" "}
        <Link href="/cookies" className="text-primary underline">
          Cookie Policy
        </Link>
        ,{" "}
        <Link href="/disclaimer" className="text-primary underline">
          Disclaimer
        </Link>{" "}
        and{" "}
        <Link href="/acceptable-use" className="text-primary underline">
          Acceptable Use Policy
        </Link>
        .
      </p>
    </article>
  );
}
