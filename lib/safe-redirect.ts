/**
 * @file safe-redirect.ts
 * @description Constrains caller-supplied redirect targets to paths inside this application.
 */

/**
 * Returns `value` when it is a path within this app, and undefined otherwise.
 *
 * `?next=` arrives on an unauthenticated route from anywhere — a link in an
 * email, a search result, an attacker's page. Everything below is a way of
 * writing "somewhere else" that still starts with a slash:
 *
 * - `//evil.example` is a protocol-relative absolute URL
 * - `/\evil.example` is treated as `//` by several browsers
 * - `https://evil.example` needs no slash at all
 *
 * The login form feeds the result to `router.replace()`, which treats it as an
 * app route rather than a location assignment — so this is defence in depth
 * rather than the only guard. It is also what the file's own docstring already
 * claimed to provide.
 */
export function safeNextPath(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.startsWith('/')) return undefined;
  if (value.startsWith('//') || value.startsWith('/\\')) return undefined;
  return value;
}
