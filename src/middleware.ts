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
 * Run Clerk on all app routes (not static assets) so auth is available during SSR.
 * Without this on `/` and `/search`, the sticky header only learns signed-in state
 * after client Clerk loads — which feels like the nav "settling" on the custom
 * domain (where live Clerk sessions exist) but not on workers.dev.
 *
 * Routes that call auth() also need middleware; missing it can 500 those pages.
 */
export const config = {
  matcher: [
    // Skip Next.js internals and static files (same pattern Clerk recommends)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
