"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/tasks", label: "Tasks" },
  { href: "/jobs.html", label: "Jobs" },
  { href: "/join-as-expert", label: "Join as Expert" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 md:py-3">
        <BrandMark />

        <nav className="hidden items-center gap-0.5 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            >
              Dashboard
            </Link>
          )}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button size="sm" className="ml-2">
                Sign in
              </Button>
            </SignInButton>
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
          "border-t border-border bg-surface md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-0.5 px-4 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[4px] px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="rounded-[4px] px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-primary"
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
