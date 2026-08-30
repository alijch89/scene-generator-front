/**
 * @file api.ts
 * @description Provides the shared credentialed JSON client used by browser and server code.
 */

/** Public backend base URL, configurable through NEXT_PUBLIC_API_URL. */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

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
  const res = await fetch(`${API_URL}${path}`, {
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
