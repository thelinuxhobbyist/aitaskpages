"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ExternalPrefetchLink } from "@/components/external-prefetch-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
  /** Quieter treatment for secondary features (e.g. vacancies). */
  secondary?: boolean;
};

const marketplaceLinks: NavLink[] = [
  { href: "/", label: "Experts" },
  { href: "/tasks", label: "Tasks" },
  { href: "/dashboard/requirements/new", label: "Post a Task" },
];

const secondaryLinks: NavLink[] = [
  { href: "/jobs", label: "Vacancies", secondary: true },
  {
    href: "https://finder.aijobsmarket.co.uk",
    label: "Software Finder",
    external: true,
    secondary: true,
  },
];

const publicLinks: NavLink[] = [...marketplaceLinks, ...secondaryLinks];

const guestLinks: NavLink[] = [
  ...marketplaceLinks,
  { href: "/join-as-expert", label: "Join as Expert" },
  ...secondaryLinks,
];

const navLinkClass =
  "text-[0.9375rem] font-medium tracking-[-0.01em] text-on-surface-variant transition-colors hover:text-on-surface md:text-base";

const navLinkSecondaryClass =
  "text-[0.875rem] font-medium tracking-[-0.01em] text-muted transition-colors hover:text-on-surface-variant md:text-[0.9375rem]";

export function Header() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const links = isSignedIn ? publicLinks : guestLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[5.5rem] max-w-6xl items-center justify-between gap-6 px-5 py-2 md:min-h-[6rem]">
        <BrandMark />

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) =>
            link.external ? (
              <ExternalPrefetchLink
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={link.secondary ? navLinkSecondaryClass : navLinkClass}
              >
                {link.label}
              </ExternalPrefetchLink>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={link.secondary ? navLinkSecondaryClass : navLinkClass}
              >
                {link.label}
              </Link>
            ),
          )}
          {isSignedIn && (
            <Link href="/dashboard" className={navLinkClass}>
              Dashboard
            </Link>
          )}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button size="sm" variant="ghost" className="text-[0.9375rem]">
                  Sign in
                </Button>
              </SignInButton>
              <Button
                size="sm"
                variant="ink"
                asChild
                className="rounded-lg text-[0.9375rem]"
              >
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-on-surface md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border/60 bg-surface md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {links.map((link) =>
            link.external ? (
              <ExternalPrefetchLink
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "rounded-lg px-3 py-3 tracking-[-0.01em] hover:bg-surface-container",
                  link.secondary
                    ? "text-[0.9375rem] font-medium text-muted hover:text-on-surface-variant"
                    : "text-base font-medium text-on-surface-variant hover:text-on-surface",
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </ExternalPrefetchLink>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-3 tracking-[-0.01em] hover:bg-surface-container",
                  link.secondary
                    ? "text-[0.9375rem] font-medium text-muted hover:text-on-surface-variant"
                    : "text-base font-medium text-on-surface-variant hover:text-on-surface",
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-3 text-base font-medium tracking-[-0.01em] text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {!isSignedIn && (
            <div className="mt-2 flex flex-col gap-2">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button size="sm" variant="outline" className="w-full">
                  Sign in
                </Button>
              </SignInButton>
              <Button size="sm" variant="ink" asChild className="w-full rounded-lg">
                <Link href="/sign-up" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
