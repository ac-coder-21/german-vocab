import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";

import { sessionOptions, type SessionData } from "@/lib/auth/session-options";

const PUBLIC_PATHS = ["/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const response = NextResponse.next();
  // Optimistic check only (reads the signed cookie, no DB round trip) — per
  // Next's own guidance, Proxy runs on every route including prefetches, so
  // it should stay cheap. Server Actions/pages re-verify via getSession().
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  const isAuthenticated = Boolean(session.userId);

  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
