import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Header } from "@/components/header";
import { SiteStructuredData } from "@/components/site-structured-data";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-config";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

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
      <html lang="en-GB">
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
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
            rel="stylesheet"
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
