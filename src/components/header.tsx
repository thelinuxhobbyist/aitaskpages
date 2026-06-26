"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/freelancers", label: "Experts" },
  { href: "/join-as-expert", label: "Join as Expert" },
  { href: "/index.html", label: "Jobs" },
  { href: "/ai-jobs-london.html", label: "London" },
  { href: "/remote-ai-jobs-uk.html", label: "Remote" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface md-elevation-1">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-medium tracking-tight text-primary"
        >
          <span className="material-symbols-outlined text-2xl">groups</span>
          AI Jobs Market
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="rounded-full px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            >
              Dashboard
            </Link>
          )}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button size="sm">Sign in</Button>
            </SignInButton>
          )}
        </nav>

        <button
          type="button"
          className="rounded-full p-2 text-on-surface md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border bg-surface md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {!isSignedIn && (
            <SignInButton mode="modal">
              <Button size="sm" className="mt-2 w-full">
                Sign in
              </Button>
            </SignInButton>
          )}
        </nav>
      </div>
    </header>
  );
}
