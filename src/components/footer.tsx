import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading text-lg font-semibold text-white">
            AI Jobs Market
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            The UK&apos;s platform for AI job listings and expert discovery.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Jobs
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/index.html" className="hover:text-white">
                All jobs
              </Link>
            </li>
            <li>
              <Link href="/ai-jobs-london.html" className="hover:text-white">
                London
              </Link>
            </li>
            <li>
              <Link href="/remote-ai-jobs-uk.html" className="hover:text-white">
                Remote
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Experts
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/freelancers" className="hover:text-white">
                Browse experts
              </Link>
            </li>
            <li>
              <Link href="/join-as-expert" className="hover:text-white">
                Join as expert
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Contact
          </p>
          <p className="text-sm">
            <a
              href="mailto:contact@aijobsmarket.co.uk"
              className="hover:text-white"
            >
              contact@aijobsmarket.co.uk
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} AI Jobs Market. All rights reserved.
      </div>
    </footer>
  );
}
