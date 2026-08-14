import 'server-only';

import { forbidden, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { ApiError, request } from './api';
import { SESSION_COOKIE, type Role, type UserDto } from './session';

/**
 * The real gate. proxy.ts only does optimistic redirects off a readable
 * cookie; everything that actually depends on identity goes through here,
 * which validates the session against the API on every render pass.
 *
 * cache() dedupes it per request, so a layout and its pages calling it
 * repeatedly still costs one round trip.
 */
export const getCurrentUser = cache(async (): Promise<UserDto | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    return await request<UserDto>('/auth/me', {
      cookie: `${SESSION_COOKIE}=${token}`,
    });
  } catch (err) {
    // 401 just means the session is gone; anything else is a real fault and
    // should not be silently rendered as "logged out".
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
});

/** Redirects to login when there is no valid session. */
export async function verifySession(): Promise<UserDto> {
  const user = await getCurrentUser();
  if (!user) redirect('/login?reason=expired');
  return user;
}

export async function requireRole(...roles: Role[]): Promise<UserDto> {
  const user = await verifySession();
  if (!roles.includes(user.role)) forbidden();
  return user;
}

export const requireAdmin = () => requireRole('ADMIN');
export const requireParent = () => requireRole('PARENT');

/** Forwards the caller's session cookie to the API from a server component. */
export async function serverCookieHeader(): Promise<string | undefined> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? `${SESSION_COOKIE}=${token}` : undefined;
}

/**
 * A session can expire after the layout has validated it but before a page's
 * data request reaches the API. Keep that ordinary case out of error
 * boundaries and send the user through the existing sign-in flow instead.
 */
async function withSessionExpiryRedirect<T>(requestPromise: Promise<T>) {
  try {
    return await requestPromise;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect('/login?reason=expired');
    }
    throw err;
  }
}

/**
 * `api` with this request's session attached. Server components read through
 * it; writes stay in client components, which have the cookie already.
 */
export const sapi = {
  get: async <T>(path: string) =>
    withSessionExpiryRedirect(
      request<T>(path, { method: 'GET', cookie: await serverCookieHeader() }),
    ),
  /**
   * Only for idempotent server-side calls made while rendering — re-requesting
   * a payment link, for instance. Real writes belong in client components,
   * which already hold the cookie.
   */
  post: async <T>(path: string, body?: unknown) =>
    withSessionExpiryRedirect(
      request<T>(path, {
        method: 'POST',
        body,
        cookie: await serverCookieHeader(),
      }),
    ),
};
