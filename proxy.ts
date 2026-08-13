import { NextResponse, type NextRequest } from 'next/server';
import { ROLE_HINT_COOKIE, SESSION_COOKIE, type Role } from '@/lib/session';

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

const AUTH_PREFIXES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

const startsWith = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`));

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  const role = req.cookies.get(ROLE_HINT_COOKIE)?.value as Role | undefined;

  const isAdminArea = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
  const isParentArea = startsWith(pathname, PARENT_PREFIXES);
  const isAuthArea = startsWith(pathname, AUTH_PREFIXES);

  if (!hasSession && (isAdminArea || isParentArea)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    // So the login page can show «برای امنیت حساب از سیستم خارج شدید».
    url.searchParams.set('reason', 'expired');
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (hasSession && isAuthArea) {
    const url = req.nextUrl.clone();
    url.pathname = role === 'ADMIN' ? '/admin' : '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Keep each role in its own half of the product.
  if (hasSession && isAdminArea && role === 'PARENT') {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (hasSession && isParentArea && role === 'ADMIN') {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)'],
};
