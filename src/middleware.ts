import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import {
  authRoutes,
  defaultLoginRedirect,
  publicRoutes,
  redirects,
} from "./routes";
import { MAX_REF_COOKIE_AGE } from "./lib/utils";

function rewriteSubdomain(request: NextRequest): NextResponse | void {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "sample.com";
  const isLocalhost = host.includes("localhost");

  let subdomain = "";
  if (isLocalhost) {
    const parts = host.split(".");
    subdomain = parts.length > 1 ? parts[0] : "";
  } else if (host.endsWith(baseDomain)) {
    subdomain = host.replace(`.${baseDomain}`, "");
  }

  if (
    subdomain &&
    subdomain !== "www" &&
    !url.pathname.startsWith("/_next") &&
    !url.pathname.startsWith("/api")
  ) {
    url.pathname = `/${subdomain}`;
    return NextResponse.rewrite(url);
  }
}

export default auth((req) => {
  const rewritten = rewriteSubdomain(req);
  if (rewritten) return rewritten;

  const { nextUrl } = req;
  const refId = nextUrl.searchParams.get("ref");

  if (refId) {
    const cookie = req.cookies.get("referral_id");
    if (!cookie) {
      const res = NextResponse.next();
      res.cookies.set("r_id", refId, { maxAge: MAX_REF_COOKIE_AGE });
      return res;
    }
  }

  const matchedRedirect = redirects.find((r) => nextUrl.pathname === r.from);
  if (matchedRedirect) {
    return NextResponse.redirect(new URL(matchedRedirect.to, nextUrl));
  }

  const isLoggedIn = !!req.auth;
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublic = publicRoutes.includes(nextUrl.pathname);

  if (isApiRoute) return;
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(defaultLoginRedirect, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL(authRoutes[0], nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/api/:path*", "/trpc/:path*"],
};
