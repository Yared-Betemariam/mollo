import { NextResponse } from "next/server";
import { auth } from "./auth";
import {
  authRoutes,
  defaultLoginRedirect,
  paths,
  publicRoutes,
  redirects,
} from "./routes";
import { MAX_REF_COOKIE_AGE } from "./lib/utils";

export default auth((req) => {
  const { nextUrl } = req;
  const refId = nextUrl.searchParams.get("ref");

  if (!paths.includes(nextUrl.pathname)) {
    return;
  }

  if (refId) {
    const cookie = req.cookies.get("ref");
    if (!cookie) {
      const res = NextResponse.next();
      res.cookies.set("ref", refId, { maxAge: MAX_REF_COOKIE_AGE });
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
    const loginUrl = new URL(authRoutes[0], nextUrl);
    loginUrl.searchParams.set("redirectto", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/api/:path*", "/trpc/:path*"],
};
