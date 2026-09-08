"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { DocumentLink } from "@/components/document-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const baseNavLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Experts" },
  { href: "/tasks", label: "Tasks" },
  { href: "/tasks/new", label: "Post a Task" },
];

const loggedOutLinks = [
  ...baseNavLinks,
  { href: "/join-as-expert", label: "Join as an Expert" },
];

const loggedInLinks = [
  ...baseNavLinks,
  { href: "/dashboard", label: "Dashboard" },
];

function isPostTaskPath(pathname: string) {
  return (
    pathname === "/tasks/new" ||
    pathname.startsWith("/tasks/new") ||
    pathname === "/dashboard/requirements/new" ||
    pathname.startsWith("/dashboard/requirements/new")
  );
}

function isProtectedNavHref(href: string) {
  return href === "/tasks/new" || href === "/dashboard";
}

function isNavActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";

  if (href === "/tasks/new" || href === "/dashboard/requirements/new") {
    return isPostTaskPath(pathname);
  }

  if (href === "/dashboard") {
    return pathname.startsWith("/dashboard") && !isPostTaskPath(pathname);
  }

  if (href === "/search") {
    return (
      pathname === "/search" ||
      pathname.startsWith("/search/") ||
      pathname === "/experts" ||
      pathname.startsWith("/experts/") ||
      pathname === "/freelancers" ||
      pathname.startsWith("/freelancers/")
    );
  }

  if (href === "/tasks") {
    return (
      (pathname === "/tasks" || pathname.startsWith("/tasks/")) &&
      !isPostTaskPath(pathname)
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const pathname = usePathname() ?? "";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = isSignedIn ? loggedInLinks : loggedOutLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[4.75rem] max-w-6xl items-stretch justify-between gap-6 px-5 py-2 md:min-h-[5.5rem]">
        <BrandMark className="self-center" />

        <div className="hidden items-stretch gap-8 md:flex">
          <nav className="flex items-stretch gap-7" aria-label="Primary">
            {links.map((link) => {
              const active = isNavActive(link.href, pathname);
              const NavLink = isProtectedNavHref(link.href) ? DocumentLink : Link;
              return (
                <NavLink
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "-mb-px flex items-center border-b-2 text-[0.9375rem] tracking-[-0.01em] transition-colors md:text-base",
                    active
                      ? "border-ink font-semibold text-on-surface"
                      : "border-transparent font-medium text-on-surface-variant hover:text-on-surface",
                  )}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
          {isSignedIn ? (
            <div className="flex items-center self-center">
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-2 self-center">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
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
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {isSignedIn && <UserButton />}
          <button
            type="button"
            className="self-center rounded-md p-2 text-on-surface"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border/60 bg-surface md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Primary">
          {links.map((link) => {
            const active = isNavActive(link.href, pathname);
            const NavLink = isProtectedNavHref(link.href) ? DocumentLink : Link;
            return (
              <NavLink
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-3 text-base tracking-[-0.01em]",
                  active
                    ? "bg-surface-container font-semibold text-on-surface"
                    : "font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                )}
              >
                {link.label}
              </NavLink>
            );
          })}
          {!isSignedIn ? (
            <div className="mt-2 flex flex-col gap-2">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <Button size="sm" variant="outline" className="w-full">
                  Sign in
                </Button>
              </SignInButton>
              <Button size="sm" variant="ink" asChild className="w-full rounded-lg">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-2 border-t border-border/60 pt-3">
              <div className="flex items-center gap-3 px-3 py-2">
                <UserButton />
                <span className="text-sm font-medium text-on-surface">
                  Account settings
                </span>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
