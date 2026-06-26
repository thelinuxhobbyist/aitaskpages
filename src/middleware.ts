import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { syncClerkEnvFromBindings } from "@/lib/clerk-env";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

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
    // Sign-in/up render client-side; skip middleware to avoid edge env issues on Cloudflare
    "/((?!_next|sign-in|sign-up|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
