"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ExternalPrefetchLink } from "@/components/external-prefetch-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/tasks", label: "Tasks" },
  { href: "/jobs.html", label: "Jobs" },
  { href: "https://finder.aijobsmarket.co.uk", label: "Software Finder", external: true },
];

const guestLinks = [
  ...publicLinks,
  { href: "/join-as-expert", label: "Join as Expert" },
];

const navLinkClass =
  "text-sm font-medium text-muted transition-colors hover:text-on-surface";

export function Header() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const links = isSignedIn ? publicLinks : guestLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <BrandMark />

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) =>
            "external" in link && link.external ? (
              <ExternalPrefetchLink
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={navLinkClass}
              >
                {link.label}
              </ExternalPrefetchLink>
            ) : (
              <Link key={link.href} href={link.href} className={navLinkClass}>
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
            <div className="ml-1 flex items-center gap-2">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button size="sm" variant="ghost" className="text-xs">
                  Sign in
                </Button>
              </SignInButton>
              <Button size="sm" variant="ink" asChild className="rounded-lg text-xs">
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
            "external" in link && link.external ? (
              <ExternalPrefetchLink
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-container hover:text-on-surface"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </ExternalPrefetchLink>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-container hover:text-on-surface"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-container hover:text-on-surface"
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
