import { NextResponse, type NextRequest } from 'next/server';
import {
  ADMIN_ROLES,
  ROLE_HINT_COOKIE,
  SESSION_COOKIE,
  type Role,
} from '@/lib/session';

/**
 * Optimistic gate only — it reads cookies and never touches the API, because
 * it runs on every request including prefetches. Real enforcement lives in
 * lib/dal.ts and, ultimately, in the API's RolesGuard.
 */

const ADMIN_PREFIX = '/admin';
const PARENT_PREFIXES = [
  '/dashboard',
  '/library',
  '/favorites',
  '/downloads',
  '/children',
  '/profile',
  '/settings',
  '/transactions',
  '/notifications',
  '/help',
  '/wizard',
  '/stories',
  '/checkout',
  // Reached with a session already in hand — verification signs the parent in
  // before they pick a password — so it gates like the rest of the app, not
  // like the auth pages it sits beside.
  '/set-password',
];

const AUTH_PREFIXES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-phone',
];

/** Returns whether a pathname equals or descends from one of the route prefixes. */
const startsWith = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`));

/**
 * Applies optimistic login and role redirects without performing network I/O.
 *
 * @param req - Incoming Next.js request with URL and cookie access.
 * @returns A redirect, a cookie-clearing continuation, or the unchanged request.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  const role = req.cookies.get(ROLE_HINT_COOKIE)?.value as Role | undefined;
  const isAdminRole = role !== undefined && ADMIN_ROLES.includes(role);

  const isAdminArea = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
  const isParentArea = startsWith(pathname, PARENT_PREFIXES);
  const isAuthArea = startsWith(pathname, AUTH_PREFIXES);
  const isExpiredLogin =
    pathname === '/login' && req.nextUrl.searchParams.get('reason') === 'expired';

  if (!hasSession && (isAdminArea || isParentArea)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    // So the login page can show «برای امنیت حساب از سیستم خارج شدید».
    url.searchParams.set('reason', 'expired');
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // A server-rendered request can discover that this cookie is stale after
  // proxy.ts has let it through. Let the login page clear it and show the
  // session-expired message instead of bouncing the user in a redirect loop.
  if (hasSession && isExpiredLogin) {
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE);
    response.cookies.delete(ROLE_HINT_COOKIE);
    return response;
  }

  if (hasSession && isAuthArea) {
    const url = req.nextUrl.clone();
    url.pathname = isAdminRole ? '/admin' : '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Keep each role in its own half of the product.
  if (hasSession && isAdminArea && !isAdminRole) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (hasSession && isParentArea && isAdminRole) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/** Limits proxy execution to document routes, excluding framework and SVG assets. */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)'],
};
/**
 * @file proxy.ts
 * @description Performs fast cookie-only route redirects before App Router rendering; authoritative checks remain in the DAL and API.
 */
