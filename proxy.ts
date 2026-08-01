import { NextRequest, NextResponse } from "next/server";

/** Route prefixes whose pages require the presence of a session cookie. */
const protectedRoutes = [
  "/profile",
  "/change-password",
  "/dashboard",
  "/stories",
  "/billing",
];
/** Exact guest-only routes that redirect when a session cookie is present. */
const guestRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/welcome",
];

/**
 * Performs an optimistic session-cookie redirect at the Next.js request edge.
 *
 * Security:
 * Cookie presence is only a user-experience hint, not authentication. Backend
 * route handlers and Nest guards validate every protected API request. The
 * `next` parameter preserves only the current local pathname.
 *
 * @param request Incoming Next.js request.
 * @returns Redirect for obvious guest/session mismatches, otherwise continuation.
 */
export function proxy(request: NextRequest) {
  const cookieName = process.env.SESSION_COOKIE_NAME ?? "sid";
  const hasSession = Boolean(request.cookies.get(cookieName)?.value);
  const path = request.nextUrl.pathname;
  if (protectedRoutes.some((route) => path.startsWith(route)) && !hasSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }
  if (guestRoutes.includes(path) && hasSession) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }
  return NextResponse.next();
}

/** Limits proxy execution to authentication-sensitive page routes. */
export const config = {
  matcher: [
    "/profile/:path*",
    "/change-password/:path*",
    "/dashboard/:path*",
    "/stories/:path*",
    "/billing/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/welcome",
  ],
};
