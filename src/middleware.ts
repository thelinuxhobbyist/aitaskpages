import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

/** Clerk keys for OpenNext on Cloudflare — read per request, not at module load. */
function clerkKeys() {
  return {
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  };
}

const clerkHandler = clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  () => clerkKeys()
);

/** Set PREVIEW_SKIP_AUTH=1 for local UI preview without real Clerk keys. */
export default process.env.PREVIEW_SKIP_AUTH === "1"
  ? (_req: NextRequest) => NextResponse.next()
  : clerkHandler;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
