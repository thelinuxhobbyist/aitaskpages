import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-config";
import { getClerkEnvSync, syncClerkEnvFromBindings } from "@/lib/clerk-env";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const clerkHandler = clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
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
    // Only routes that need Clerk — public directory pages skip middleware entirely
    "/dashboard/:path*",
    "/__clerk/:path*",
  ],
};
