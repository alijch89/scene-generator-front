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
export type Role = 'SuperAdmin' | 'Admin' | 'User';

/** Roles that land in the admin panel rather than the family dashboard. */
export const ADMIN_ROLES: Role[] = ['SuperAdmin', 'Admin'];

/** Safe account response returned by GET /auth/me. */
export interface UserDto {
  id: string;
  fullName: string;
  phone: string | null;
  /** Every role held by the account. */
  roles: Role[];
  /** Highest-privilege role, which is what navigation routes on. */
  role: Role;
  phoneVerified: boolean;
  prefs: NotificationPrefs;
  createdAt: string;
}

/** Returns the default post-login route for a role. */
export const homeFor = (role: Role) =>
  ADMIN_ROLES.includes(role) ? '/admin' : '/dashboard';
