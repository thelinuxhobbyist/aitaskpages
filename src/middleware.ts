import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { getClerkEnvSync, syncClerkEnvFromBindings } from "@/lib/clerk-env";
import {
  COMING_SOON_COOKIE,
  COMING_SOON_QUERY,
  comingSoonBypassToken,
  hasComingSoonBypass,
  isComingSoonEnabled,
  isComingSoonExemptPath,
} from "@/lib/coming-soon";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

/**
 * Do not pass `secretKey` / `publishableKey` as clerkMiddleware options.
 * That is Clerk's "dynamic keys" path and requires CLERK_ENCRYPTION_KEY.
 * On Workers (compatibility_date >= 2025-04-01), secrets/vars are on
 * process.env via nodejs_compat_populate_process_env; syncClerkEnvFromBindings
 * covers any that OpenNext's Object.entries init skipped.
 */
const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set(
      "redirect_url",
      req.nextUrl.pathname + req.nextUrl.search
    );
    await auth.protect({ unauthenticatedUrl: signInUrl.toString() });
  }
});

function applyComingSoonHeaders(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store, must-revalidate");
  return response;
}

function comingSoonBypassCookieOptions(req: NextRequest) {
  return {
    httpOnly: true,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

/** Cover the public site while it is unfinished. APIs and a preview cookie still work. */
function comingSoonResponse(req: NextRequest): NextResponse | null {
  if (!isComingSoonEnabled()) return null;

  const { pathname } = req.nextUrl;
  if (isComingSoonExemptPath(pathname)) return null;

  const token = comingSoonBypassToken();
  const preview = req.nextUrl.searchParams.get(COMING_SOON_QUERY);

  if (preview !== null) {
    const nextUrl = req.nextUrl.clone();
    nextUrl.searchParams.delete(COMING_SOON_QUERY);
    const destination = new URL(nextUrl.pathname + nextUrl.search, req.url);

    if (preview === "off" || preview === "0") {
      const response = NextResponse.redirect(destination);
      response.cookies.delete(COMING_SOON_COOKIE);
      return response;
    }

    if (token && preview === token) {
      const response = NextResponse.redirect(destination);
      response.cookies.set(
        COMING_SOON_COOKIE,
        token,
        comingSoonBypassCookieOptions(req),
      );
      return response;
    }
  }

  if (hasComingSoonBypass(req.cookies.get(COMING_SOON_COOKIE)?.value)) {
    return null;
  }

  if (pathname === "/coming-soon") {
    return applyComingSoonHeaders(NextResponse.next());
  }

  const rewriteUrl = req.nextUrl.clone();
  rewriteUrl.pathname = "/coming-soon";
  rewriteUrl.search = "";
  return applyComingSoonHeaders(NextResponse.rewrite(rewriteUrl));
}

async function middleware(req: NextRequest, event: NextFetchEvent) {
  const cover = comingSoonResponse(req);
  if (cover) return cover;

  syncClerkEnvFromBindings();
  const { secretKey } = getClerkEnvSync();
  // Clerk throws and Next serves pages/_error when secretKey is missing
  // (cold Worker, local without .env). Page-level requireUser() still gates UI.
  if (!secretKey) {
    console.error(
      "Clerk secretKey missing in middleware — continuing without auth.protect",
    );
    return NextResponse.next();
  }

  try {
    return await clerkHandler(req, event);
  } catch (err) {
    console.error("Clerk middleware failed — continuing without auth.protect:", err);
    return NextResponse.next();
  }
}

function withComingSoon(
  handler: (req: NextRequest, event: NextFetchEvent) => Promise<NextResponse> | NextResponse,
) {
  return async (req: NextRequest, event: NextFetchEvent) => {
    const cover = comingSoonResponse(req);
    if (cover) return cover;
    return handler(req, event);
  };
}

export default process.env.PREVIEW_SKIP_AUTH === "1"
  ? withComingSoon((_req: NextRequest) => NextResponse.next())
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
