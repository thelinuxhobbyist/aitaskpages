import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-container">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-medium text-on-surface">AI Jobs Market</p>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            The UK&apos;s directory for AI experts — plus curated AI job
            listings.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-on-surface">
            Experts
          </p>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li>
              <Link href="/freelancers" className="hover:text-primary">
                Browse experts
              </Link>
            </li>
            <li>
              <Link href="/join-as-expert" className="hover:text-primary">
                Join as expert
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-on-surface">
            Jobs
          </p>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li>
              <Link href="/index.html" className="hover:text-primary">
                All jobs
              </Link>
            </li>
            <li>
              <Link href="/ai-jobs-london.html" className="hover:text-primary">
                London
              </Link>
            </li>
            <li>
              <Link href="/remote-ai-jobs-uk.html" className="hover:text-primary">
                Remote
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-on-surface">
            Contact
          </p>
          <p className="text-sm text-on-surface-variant">
            <a
              href="mailto:contact@aijobsmarket.co.uk"
              className="hover:text-primary"
            >
              contact@aijobsmarket.co.uk
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-on-surface-variant">
        &copy; {new Date().getFullYear()} AI Jobs Market. All rights reserved.
      </div>
    </footer>
  );
}
