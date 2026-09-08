import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-config";
import { getClerkEnvSync, syncClerkEnvFromBindings } from "@/lib/clerk-env";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

const clerkHandler = clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set(
        "redirect_url",
        req.nextUrl.pathname + req.nextUrl.search
      );
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
  const { secretKey } = getClerkEnvSync();
  // Clerk throws and Next serves pages/_error with body{display:none} — a blank
  // screen — when secretKey is missing (cold Worker, local without .env).
  // Let the request through; page-level requireUser() still gates the UI.
  if (!secretKey) {
    console.error(
      "Clerk secretKey missing in middleware — continuing without auth.protect",
    );
    return NextResponse.next();
  }
  return clerkHandler(req, event);
}

export default process.env.PREVIEW_SKIP_AUTH === "1"
  ? (_req: NextRequest) => NextResponse.next()
  : middleware;

/**
 * Routes that call auth() on the server MUST be listed here.
 * /tasks/[id] uses RequirementInterestPanel → auth(); without this matcher it 500s.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/setup",
    "/sign-in",
    "/sign-in/:path*",
    "/sign-up",
    "/sign-up/:path*",
    "/__clerk/:path*",
    "/tasks",
    "/tasks/:path*",
    "/experts/:path+",
    "/freelancers/:path+",
    "/api/upload",
  ],
};
