import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ExternalPrefetchLink } from "@/components/external-prefetch-link";
import { FooterSocialRow } from "@/components/footer-social-row";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer w-full shrink-0">
      <div className="footer-main">
        <FooterSocialRow />

        <div className="footer-container">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <BrandMark size="footer" />
            </div>
            <p className="footer-tagline">
              Find AI experts and post AI tasks across the UK. Connect directly
              — no commissions, no middlemen.
            </p>
            <div className="footer-contact-info">
              <span className="contact-label">Get in touch</span>
              <a
                href="mailto:contact@aijobsmarket.co.uk"
                className="contact-email"
              >
                contact@aijobsmarket.co.uk
              </a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h3>Marketplace</h3>
              <ul>
                <li>
                  <Link href="/">Browse Experts</Link>
                </li>
                <li>
                  <Link href="/tasks">Browse Tasks</Link>
                </li>
                <li>
                  <Link href="/dashboard/requirements/new">Post a Task</Link>
                </li>
                <li>
                  <Link href="/join-as-expert">Join as an Expert</Link>
                </li>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Also on the site</h3>
              <ul>
                <li>
                  <a href="/jobs">AI vacancies</a>
                </li>
                <li>
                  <a href="/ai-jobs-london.html">London vacancies</a>
                </li>
                <li>
                  <a href="/remote-ai-jobs-uk.html">Remote vacancies</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Company</h3>
              <ul>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <ExternalPrefetchLink
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AI Software Finder
                  </ExternalPrefetchLink>
                </li>
                <li>
                  <a href="mailto:contact@aijobsmarket.co.uk">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Legal</h3>
              <ul>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/cookies">Cookie Policy</Link>
                </li>
                <li>
                  <Link href="/disclaimer">Disclaimer</Link>
                </li>
                <li>
                  <Link href="/acceptable-use">Acceptable Use Policy</Link>
                </li>
                <li>
                  <Link href="/expert-terms">AI Expert Terms</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-disclaimer">
            <strong>AI Jobs Market</strong> is an AI expert directory and task
            marketplace. We provide a platform for businesses and independent AI
            professionals to connect and communicate. AI Jobs Market is not
            responsible for contracts, project delivery or payments between
            users. Any agreement is made directly between the client and the
            expert.
          </p>
          <div className="footer-copyright">
            &copy; {year} AI Jobs Market. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
