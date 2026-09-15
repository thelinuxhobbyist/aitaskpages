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
              Find AI experts for your tasks and projects. Post a task or
              discover the right expertise.
            </p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h3>Connect</h3>
              <ul>
                <li>
                  <Link href="/search">Find AI Experts</Link>
                </li>
                <li>
                  <Link href="/tasks">Browse AI Tasks</Link>
                </li>
                <li>
                  <DocumentLink href="/tasks/new">Post an AI Task</DocumentLink>
                </li>
                <li>
                  <Link href="/create-a-profile">Create a Profile</Link>
                </li>
                <li>
                  <DocumentLink href="/dashboard">Dashboard</DocumentLink>
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
            <strong>AI Task Pages</strong> is a directory of AI professionals
            and companies, and an introduction platform. Our role is simply to
            provide a place where people and companies can discover each other
            and connect. What happens after that introduction is entirely
            between the parties and is independent of AI Task Pages.
          </p>
          <p className="footer-family-line">
            AI Task Pages · Part of the AI Jobs Market family
          </p>
          <div className="footer-copyright">
            &copy; {year} AI Task Pages. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
