import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-config";
import { getClerkEnvSync } from "@/lib/clerk-env";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

/** Keys for clerkMiddleware — process.env is populated from Cloudflare env in worker init. */
function clerkMiddlewareKeys() {
  const fromContext = getClerkEnvSync();
  return {
    secretKey: fromContext.secretKey ?? process.env.CLERK_SECRET_KEY,
    publishableKey:
      fromContext.publishableKey ??
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
      CLERK_PUBLISHABLE_KEY,
  };
}

const clerkHandler = clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  () => clerkMiddlewareKeys()
);

/** Set PREVIEW_SKIP_AUTH=1 for local UI preview without real Clerk keys. */
export default process.env.PREVIEW_SKIP_AUTH === "1"
  ? (_req: NextRequest) => NextResponse.next()
  : clerkHandler;

export const config = {
  matcher: [
    // Sign-in/up render client-side; skip middleware to avoid edge env issues on Cloudflare
    "/((?!_next|sign-in|sign-up|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
