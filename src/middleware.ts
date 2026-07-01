import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-config";
import { getClerkEnvSync, syncClerkEnvFromBindings } from "@/lib/clerk-env";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const clerkHandler = clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      // Send signed-out users to sign-in (and back) rather than a 404 — this
      // keeps the "log in to continue the conversation" email flow working.
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      await auth.protect({ unauthenticatedUrl: signInUrl.toString() });
    }
  },
  () => {
    syncClerkEnvFromBindings();
    const { secretKey, publishableKey } = getClerkEnvSync();
    return {
      secretKey,
      publishableKey: publishableKey || CLERK_PUBLISHABLE_KEY,
    };
  }
);

function middleware(req: NextRequest, event: NextFetchEvent) {
  syncClerkEnvFromBindings();
  return clerkHandler(req, event);
}

/** Set PREVIEW_SKIP_AUTH=1 for local UI preview without real Clerk keys. */
export default process.env.PREVIEW_SKIP_AUTH === "1"
  ? (_req: NextRequest) => NextResponse.next()
  : middleware;

export const config = {
  matcher: [
    // Routes that need Clerk auth context. Other public pages skip middleware.
    "/dashboard/:path*",
    "/__clerk/:path*",
    // Requirement pages call auth() for optional expert interest — not protected.
    "/tasks",
    "/tasks/:path*",
    // Profile pages need to know who is signed in (contact form is gated) and
    // their server actions POST back to these paths, so they need Clerk too.
    "/experts/:path*",
    // Legacy path — kept so the 301 redirect to /experts still resolves.
    "/freelancers/:path*",
    // Image upload endpoint authenticates the caller via Clerk.
    "/api/upload",
  ],
};
