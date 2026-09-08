import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { DocumentLink } from "@/components/document-link";
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
              Find AI experts and post AI tasks across the UK. We make the
              introduction — you connect directly.
            </p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h3>Connect</h3>
              <ul>
                <li>
                  <Link href="/search">Browse Experts</Link>
                </li>
                <li>
                  <Link href="/tasks">Browse Tasks</Link>
                </li>
                <li>
                  <DocumentLink href="/tasks/new">Post a Task</DocumentLink>
                </li>
                <li>
                  <Link href="/join-as-expert">Join as an Expert</Link>
                </li>
                <li>
                  <DocumentLink href="/dashboard">Dashboard</DocumentLink>
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
                  <Link href="/contact">Contact</Link>
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
            <strong>AI Jobs Market</strong> is an AI expert directory and
            business-to-expert introduction platform. Our role is simply to
            provide a place where businesses and independent AI professionals
            can discover each other and connect. What happens after that
            introduction is entirely between the parties and is independent of
            AI Jobs Market.
          </p>
          <div className="footer-copyright">
            &copy; {year} AI Jobs Market. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
