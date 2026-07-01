import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Cookie Policy",
  description:
    "How AIJobsMarket uses cookies and similar technologies on our website.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-secondary">
        AIJobsMarket Cookie Policy
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
          This Cookie Policy explains how AIJobsMarket (&quot;AIJobsMarket&quot;,
          &quot;we&quot;, &quot;our&quot; or &quot;us&quot;) uses cookies and
          similar technologies when you visit our website.
        </p>
        <p>
          By continuing to use AIJobsMarket, you consent to the use of cookies
          in accordance with this Cookie Policy, except where you have disabled
          them through your browser or cookie preferences.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          2. What Are Cookies?
        </h2>
        <p>
          Cookies are small text files placed on your computer, tablet or mobile
          device when you visit a website.
        </p>
        <p>
          Cookies help websites remember information about your visit, making
          the website easier to use and improving your browsing experience.
        </p>
        <p>
          Cookies do not usually identify you personally, but they may be linked
          to information that identifies you.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          3. Why We Use Cookies
        </h2>
        <p>AIJobsMarket uses cookies to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Keep users signed in.</li>
          <li>Remember your preferences.</li>
          <li>Improve website performance.</li>
          <li>Measure how visitors use the platform.</li>
          <li>Improve security.</li>
          <li>Detect abuse and fraudulent activity.</li>
          <li>Maintain reliable platform functionality.</li>
        </ul>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          4. Types of Cookies We Use
        </h2>

        <h3 className="text-lg font-semibold text-secondary">
          Essential Cookies
        </h3>
        <p>These cookies are required for the website to function correctly.</p>
        <p>Examples include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>User authentication</li>
          <li>Session management</li>
          <li>Security</li>
          <li>Load balancing</li>
        </ul>
        <p>
          Without these cookies, parts of AIJobsMarket may not function
          correctly.
        </p>

        <h3 className="pt-4 text-lg font-semibold text-secondary">
          Functional Cookies
        </h3>
        <p>These cookies remember choices you make, such as:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Language preferences</li>
          <li>Display settings</li>
          <li>User preferences</li>
        </ul>
        <p>
          These cookies improve your experience but are not strictly necessary.
        </p>

        <h3 className="pt-4 text-lg font-semibold text-secondary">
          Analytics Cookies
        </h3>
        <p>
          Analytics cookies help us understand how visitors use AIJobsMarket.
        </p>
        <p>Examples include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Pages viewed</li>
          <li>Time spent on pages</li>
          <li>Navigation paths</li>
          <li>Search activity</li>
        </ul>
        <p>This information helps us improve the platform.</p>
        <p>
          Where analytics tools are used, data is generally collected in an
          aggregated form.
        </p>

        <h3 className="pt-4 text-lg font-semibold text-secondary">
          Performance Cookies
        </h3>
        <p>
          Performance cookies help us identify technical issues and improve
          website speed and reliability.
        </p>
        <p>
          These cookies may collect anonymous technical information about how
          the platform performs.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          5. Third-Party Cookies
        </h2>
        <p>
          Some third-party services used by AIJobsMarket may place cookies on
          your device.
        </p>
        <p>Examples may include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Clerk (authentication)</li>
          <li>Cloudflare</li>
          <li>Analytics providers</li>
          <li>Embedded content providers</li>
        </ul>
        <p>
          These third parties operate under their own privacy and cookie
          policies.
        </p>
        <p>AIJobsMarket does not control third-party cookies.</p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          6. Managing Cookies
        </h2>
        <p>Most web browsers allow you to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>View cookies</li>
          <li>Delete cookies</li>
          <li>Block cookies</li>
          <li>Block third-party cookies</li>
          <li>Receive notifications before cookies are stored</li>
        </ul>
        <p>
          Disabling cookies may affect the functionality of AIJobsMarket.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          7. Changes to this Policy
        </h2>
        <p>We may update this Cookie Policy from time to time.</p>
        <p>The latest version will always be available on AIJobsMarket.</p>
        <p>
          The &quot;Last Updated&quot; date at the top of this document
          indicates when changes were last made.
        </p>
      </section>

      <hr className="my-10 border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">8. Contact</h2>
        <p>
          If you have any questions regarding this Cookie Policy, please
          contact:
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
            href="mailto:privacy@aijobsmarket.co.uk"
            className="text-primary underline"
          >
            privacy@aijobsmarket.co.uk
          </a>
        </p>
      </section>

      <hr className="my-10 border-border" />

      <p className="text-sm text-muted">
        <strong>Version 1.0</strong>
      </p>
      <p className="mt-2 text-sm text-muted">
        This Cookie Policy applies to the AIJobsMarket platform and should be
        read together with our{" "}
        <Link href="/privacy" className="text-primary underline">
          Privacy Policy
        </Link>
        .
      </p>
    </article>
  );
}
