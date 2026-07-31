import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/profile",
  "/change-password",
  "/dashboard",
  "/stories",
  "/billing",
];
const guestRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

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
  ],
};
