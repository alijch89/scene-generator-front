/** Shared between proxy.ts, the DAL and client components. No secrets here. */

import type { NotificationPrefs } from './types';

export const SESSION_COOKIE = 'sid';

/**
 * Readable copy of the role, set by the API alongside the session cookie.
 * Used only for optimistic redirects in proxy.ts — forging it changes which
 * page you get bounced to and nothing else; the API still returns 403.
 */
export const ROLE_HINT_COOKIE = 'role';

export type Role = 'ADMIN' | 'PARENT';

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  emailVerified: boolean;
  prefs: NotificationPrefs;
  createdAt: string;
}

/** Where each role lands after login. */
export const homeFor = (role: Role) =>
  role === 'ADMIN' ? '/admin' : '/dashboard';
