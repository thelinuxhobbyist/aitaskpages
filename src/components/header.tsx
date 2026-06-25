"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/index.html", label: "Jobs" },
  { href: "/freelancers", label: "Experts" },
  { href: "/join-as-expert", label: "Join as Expert" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b-4 border-primary bg-secondary text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            AI Jobs Market
          </span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="text-slate-300 transition-colors hover:text-white"
            >
              Dashboard
            </Link>
          )}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 bg-transparent text-white hover:bg-slate-800"
              >
                Sign in
              </Button>
            </SignInButton>
          )}
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-slate-700 bg-secondary md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {!isSignedIn && (
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full border-slate-600 bg-transparent text-white"
              >
                Sign in
              </Button>
            </SignInButton>
          )}
        </nav>
      </div>
    </header>
  );
}
