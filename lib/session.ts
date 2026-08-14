/**
 * @file session.ts
 * @description Shares non-secret cookie names, role types, and safe account shapes across Next.js runtimes.
 */

import type { NotificationPrefs } from './types';

/** HTTP-only session cookie name written by the backend. */
export const SESSION_COOKIE = 'sid';

/**
 * Readable copy of the role, set by the API alongside the session cookie.
 * Used only for optimistic redirects in proxy.ts — forging it changes which
 * page you get bounced to and nothing else; the API still returns 403.
 */
export const ROLE_HINT_COOKIE = 'role';

/** Account roles understood by frontend navigation and the data-access layer. */
export type Role = 'ADMIN' | 'PARENT';

/** Safe account response returned by GET /auth/me. */
export interface UserDto {
  id: string;
  fullName: string;
  phone: string | null;
  role: Role;
  phoneVerified: boolean;
  prefs: NotificationPrefs;
  createdAt: string;
}

/** Returns the default post-login route for a role. */
export const homeFor = (role: Role) =>
  role === 'ADMIN' ? '/admin' : '/dashboard';
