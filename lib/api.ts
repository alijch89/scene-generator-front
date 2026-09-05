/**
 * @file api.ts
 * @description Provides the shared credentialed JSON client used by browser and server code.
 */

/**
 * Public backend base URL, configurable through NEXT_PUBLIC_API_URL. Baked
 * into the client bundle at build time, so it is the URL a *browser* must be
 * able to reach — it also ends up in image `src` and download `href`
 * attributes across the app.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

/**
 * Base the Node server dials instead. Under Docker the browser's
 * `http://localhost:3001/api/v1` resolves to the frontend container's own
 * loopback, so server components have to address the API by its compose
 * service name. Left unset outside Docker, where one origin serves both.
 */
const SERVER_API_URL = process.env.INTERNAL_API_URL || API_URL;

/** Non-simple header required by the API for every state-changing request. */
export const CSRF_PROTECTION_HEADER = "x-csrf-protection";
export const CSRF_PROTECTION_VALUE = "1";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** Picks the base for the current execution context. */
const baseUrl = () =>
  typeof window === "undefined" ? SERVER_API_URL : API_URL;

/**
 * Header proving a request came from this server rather than a browser.
 *
 * The API throttles by client IP, and every server component in the app
 * reaches it from one address — this container's. That put all server-rendered
 * traffic into a single 120/min bucket, so the product started returning 429
 * to everyone at roughly forty page views a minute. The token marks the
 * frontend as the first-party caller it is.
 *
 * Server-only by construction: it is read from a non-`NEXT_PUBLIC_` variable,
 * which is `undefined` in the browser bundle, and applied only on the server
 * branch. Inlining it would hand every visitor the exemption.
 */
const internalHeaders = (): Record<string, string> => {
  if (typeof window !== "undefined") return {};
  const token = process.env.INTERNAL_API_TOKEN;
  return token ? { "x-internal-token": token } : {};
};

/**
 * Adds the browser-intent proof required by the API's global mutation guard.
 *
 * Browsers supply their own immutable Origin. Node fetch has no page context,
 * so server-side actions provide the configured site origin as a fallback to
 * the stronger internal token (which remains mandatory in production).
 */
const intentHeaders = (method?: string): Record<string, string> => {
  if (SAFE_METHODS.has((method ?? "GET").toUpperCase())) return {};

  const proof: Record<string, string> = {
    [CSRF_PROTECTION_HEADER]: CSRF_PROTECTION_VALUE,
  };
  if (typeof window === "undefined") {
    try {
      proof.origin = new URL(
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      ).origin;
    } catch {
      // INTERNAL_API_TOKEN is the production proof when the public URL is bad.
    }
  }
  return proof;
};

/** HTTP error that preserves response status and the parsed backend payload. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** RequestInit variant that serializes JSON bodies and optionally forwards a cookie. */
type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Server components pass the incoming Cookie header through here. */
  cookie?: string;
};

/**
 * Sends a non-cached, credentialed API request and parses its JSON response.
 *
 * @typeParam T - Expected successful response shape.
 * @param path - API path beginning with a slash.
 * @param options - Fetch options plus an optional JSON body and server cookie.
 * @returns The parsed response, or undefined for a 204 response.
 * @throws {ApiError} When the API returns a non-success status.
 */
export async function request<T>(
  path: string,
  { body, cookie, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    // The session cookie has to survive the :3000 → :3001 hop.
    credentials: "include",
    cache: init.cache ?? "no-store",
    headers: {
      ...(body === undefined || isFormData
        ? {}
        : { "content-type": "application/json" }),
      ...(cookie ? { cookie } : {}),
      ...headers,
      ...internalHeaders(),
      ...intentHeaders(init.method),
    },
    // The browser must supply FormData's boundary; JSON keeps the old client contract.
    body:
      body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  if (res.status === 204) return undefined as T;

  const payload = await res.json().catch(() => undefined);

  if (!res.ok) {
    const message =
      (payload as { message?: string | string[] })?.message ?? res.statusText;
    throw new ApiError(
      res.status,
      Array.isArray(message) ? message.join("، ") : message,
      payload,
    );
  }

  return payload as T;
}

/** Browser-oriented GET, POST, PATCH, and DELETE convenience methods. */
export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
