import { NextResponse, type NextRequest } from 'next/server';
import { safeNextPath } from '@/lib/safe-redirect';
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
];

const AUTH_PREFIXES = ['/login', '/register'];

/**
 * Needs a session but belongs to neither half of the product: an
 * administrator can reset an admin's password as well as a parent's, so both
 * roles have to be able to reach «تغییر گذرواژه» without being bounced to
 * their own home. Whether the change is actually owed is decided by the page
 * itself, which can read the account; this file only sees cookies.
 */
const SESSION_PREFIXES = ['/change-password'];

/** Returns whether a pathname equals or descends from one of the route prefixes. */
const startsWith = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`));

/**
 * Whether the router fetched this URL for the page it is on (an RSC request or
 * a prefetch) rather than the browser loading it as a document. Document loads
 * carry none of these headers.
 */
const isClientFetch = (req: NextRequest) =>
  req.headers.has('rsc') ||
  req.headers.has('next-router-prefetch') ||
  req.headers.has('next-router-segment-prefetch') ||
  req.nextUrl.searchParams.has('_rsc');

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
  const isSessionArea = startsWith(pathname, SESSION_PREFIXES);
  const isExpiredLogin =
    pathname === '/login' && req.nextUrl.searchParams.get('reason') === 'expired';
  // This very proxy is the only thing that adds `next` to an expired-login
  // URL, and it does so for a visitor with no session at all. A page that
  // renders and finds the cookie stale (lib/dal.ts) redirects without it.
  const nextAfterAnonymousRedirect = isExpiredLogin
    ? safeNextPath(req.nextUrl.searchParams.get('next'))
    : undefined;

  if (!hasSession && (isAdminArea || isParentArea || isSessionArea)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    // So the login page can show «برای امنیت حساب از سیستم خارج شدید».
    url.searchParams.set('reason', 'expired');
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // The same URL can reach a visitor who has signed in since. Next.js
  // prefetches every visible link, so a logged-out visitor's prefetch of
  // «ساخت قصه» is redirected here and the browser keeps that redirect. After
  // login it is replayed *with the new session cookie*; it must send them on
  // to where they were going, never wipe the session they just created.
  if (hasSession && nextAfterAnonymousRedirect) {
    const url = req.nextUrl.clone();
    const target = new URL(nextAfterAnonymousRedirect, req.nextUrl.origin);
    url.pathname = startsWith(target.pathname, AUTH_PREFIXES)
      ? isAdminRole
        ? '/admin'
        : '/dashboard'
      : target.pathname;
    url.search = startsWith(target.pathname, AUTH_PREFIXES) ? '' : target.search;
    return NextResponse.redirect(url);
  }

  // A server-rendered request can discover that this cookie is stale after
  // proxy.ts has let it through. Let the login page show the session-expired
  // message instead of bouncing the user in a redirect loop, and clear the
  // stale cookie while doing it.
  if (hasSession && isExpiredLogin) {
    const response = NextResponse.next();
    // Only a real page load may delete the cookie. Next.js prefetches links
    // with the visitor's cookies attached, and a prefetch is speculative: the
    // user never asked to be on that page, so it must not log them out.
    if (!isClientFetch(req)) {
      response.cookies.delete(SESSION_COOKIE);
      response.cookies.delete(ROLE_HINT_COOKIE);
    }
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
