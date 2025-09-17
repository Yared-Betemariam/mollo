import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import {
  authRoutes,
  defaultLoginRedirect,
  publicRoutes,
  redirects,
} from "./routes";
import { MAX_REF_COOKIE_AGE } from "./lib/utils";
function extractSubdomain(host: string, baseHost: string) {
  if (!host || !baseHost) return "";

  const hostNoPort = host.split(":")[0].toLowerCase();
  if (!hostNoPort.endsWith(baseHost.toLowerCase())) return "";

  const prefix = hostNoPort.slice(0, hostNoPort.length - baseHost.length - 1);
  if (!prefix) return "";

  return prefix.split(".")[0];
}

function rewriteSubdomain(request: NextRequest): NextResponse | void {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  const BASE_HOST = process.env.NEXT_PUBLIC_BASE_DOMAIN || "mollo.orpad.cc";

  let subdomain = "";

  if (host.includes("localhost")) {
    const hostNoPort = host.split(":")[0];
    const parts = hostNoPort.split(".");

    if (parts.length > 2) {
      subdomain = parts[0];
    }
  } else {
    subdomain = extractSubdomain(host, BASE_HOST);
  }

  if (!subdomain) return;

  const reserved = new Set(["", "www", "mollo"]);

  const ignorePath = (p: string) =>
    p.startsWith("/_next") || p.startsWith("/api") || p.startsWith("/trpc");

  if (subdomain && !reserved.has(subdomain) && !ignorePath(url.pathname)) {
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return;
}

export default auth((req) => {
  const rewritten = rewriteSubdomain(req);
  if (rewritten) return rewritten;

  const { nextUrl } = req;
  const refId = nextUrl.searchParams.get("ref");

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
