import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/footer";
import { DeployFreshnessGuard } from "@/components/deploy-freshness-guard";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Header } from "@/components/header";
import { SiteStructuredData } from "@/components/site-structured-data";
import { getAuthUserId } from "@/lib/auth";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-config";
import { getClerkEnv } from "@/lib/clerk-env";
import { getDeployVersion } from "@/lib/deploy-version";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  // Avoid late font swaps on hard refresh (fallback stays if font is slow)
  display: "optional",
  adjustFontFallback: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "optional",
  adjustFontFallback: true,
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...rootMetadata(),
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ publishableKey }, userId, buildId] = await Promise.all([
    getClerkEnv(),
    getAuthUserId(),
    getDeployVersion(),
  ]);

  return (
    <ClerkProvider
      publishableKey={publishableKey || CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      allowedRedirectOrigins={[
        "https://aitaskpages.com",
        "http://localhost:3000",
        "https://aitaskpages.yama.workers.dev",
      ]}
    >
      <html lang="en-GB" className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
        <head>
          <SiteStructuredData />
          <meta name="build-id" content={buildId} />
        </head>
        <body className="min-h-screen flex flex-col bg-surface">
          <DeployFreshnessGuard buildId={buildId} />
          <GoogleAnalytics />
          <Header initialSignedIn={Boolean(userId)} />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
