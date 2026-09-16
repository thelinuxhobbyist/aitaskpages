import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  COMING_SOON_COOKIE,
  isComingSoonEnabled,
  shouldServeComingSoonCover,
} from "@/lib/coming-soon";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: `Coming soon | ${SITE_NAME}` },
  description: `${SITE_NAME} is launching soon.`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ComingSoonPage() {
  if (!isComingSoonEnabled()) {
    redirect("/");
  }

  const cookieStore = await cookies();
  if (!shouldServeComingSoonCover(cookieStore.get(COMING_SOON_COOKIE)?.value)) {
    redirect("/");
  }

  return (
    <div className="relative flex h-full min-h-full flex-col overflow-hidden bg-surface">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-hero"
        aria-hidden
      />
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent-foreground">
          Coming soon
        </p>
        <h1 className="mt-6 max-w-xl text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-secondary">
          {SITE_NAME}
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted md:text-xl">
          We&apos;re putting the finishing touches on the site.
        </p>
        <p className="mt-10 text-sm text-muted">
          Enquiries:{" "}
          <a
            href="mailto:contact@aitaskpages.com"
            className="font-medium text-on-surface underline decoration-border underline-offset-4 transition-colors hover:text-accent-foreground"
          >
            contact@aitaskpages.com
          </a>
        </p>
      </div>
    </div>
  );
}
