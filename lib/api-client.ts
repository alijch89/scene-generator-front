import type { ApiErrorBody } from "./types";

/**
 * Error raised for non-success API responses.
 *
 * Carries the HTTP status and optional server correlation ID so UI errors can
 * be matched with backend logs without exposing response internals.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly correlationId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Shared in-flight refresh operation used to collapse concurrent HTTP 401s. */
let refreshPromise: Promise<boolean> | null = null;

/**
 * Requests server-side session-token rotation.
 *
 * @returns Whether the refresh endpoint returned a successful response.
 * @sideeffect Reuses one in-flight promise and clears it after settlement.
 */
async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: "{}",
    })
      .then((response) => response.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Sends a same-origin API request and parses its JSON response.
 *
 * Authentication flow:
 * A qualifying HTTP 401 triggers one shared session refresh followed by exactly
 * one retry. Authentication bootstrap and recovery endpoints never recurse.
 *
 * Security:
 * Browser cookies are sent only to same-origin Next.js routes. FormData retains
 * its browser-generated boundary; other request bodies default to JSON.
 *
 * @template T Expected success payload.
 * @param input Same-origin API path.
 * @param init Standard Fetch request options.
 * @param retry Whether one automatic refresh/retry remains available.
 * @returns Parsed success payload.
 * @throws ApiError For non-success responses after optional retry.
 */
export async function apiFetch<T>(
  input: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  const response = await fetch(input, {
    ...init,
    credentials: "same-origin",
    headers: {
      ...(init.body && !isFormData
        ? { "content-type": "application/json" }
        : {}),
      ...init.headers,
    },
  });
  if (
    response.status === 401 &&
    retry &&
    ![
      "/api/auth/refresh",
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/forgot-password",
      "/api/auth/reset-password",
    ].includes(input) &&
    (await refreshSession())
  ) {
    return apiFetch<T>(input, init, false);
  }
  const body = (await response.json().catch(() => ({}))) as ApiErrorBody & T;
  if (!response.ok) {
    const message = Array.isArray(body.message)
      ? body.message.join(". ")
      : body.message || "انجام درخواست امکان‌پذیر نبود.";
    throw new ApiError(response.status, message, body.correlationId);
  }
  return body;
}
