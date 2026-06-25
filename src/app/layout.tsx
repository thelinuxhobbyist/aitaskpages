import { ClerkProvider } from "@clerk/nextjs";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Jobs Market",
  description: "UK AI jobs board and AI expert directory",
};

async function getClerkPublishableKey(): Promise<string | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (
      env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    );
  } catch {
    return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = await getClerkPublishableKey();

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      allowedRedirectOrigins={[
        "https://aijobsmarket.co.uk",
        "http://localhost:3000",
      ]}
    >
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
