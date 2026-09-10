import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Header } from "@/components/header";
import { SiteStructuredData } from "@/components/site-structured-data";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-config";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      allowedRedirectOrigins={[
        "https://aijobsmarket.co.uk",
        "http://localhost:3000",
      ]}
    >
      <html lang="en-GB" className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
        <head>
          <link rel="preconnect" href="https://finder.aijobsmarket.co.uk" />
          <link rel="dns-prefetch" href="https://finder.aijobsmarket.co.uk" />
          <script
            type="speculationrules"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                prerender: [
                  {
                    source: "list",
                    urls: ["https://finder.aijobsmarket.co.uk/"],
                  },
                ],
              }),
            }}
          />
          <SiteStructuredData />
        </head>
        <body className="min-h-screen flex flex-col bg-surface">
          <GoogleAnalytics />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
