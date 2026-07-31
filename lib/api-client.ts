import type { ApiErrorBody } from "./types";

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

let refreshPromise: Promise<boolean> | null = null;

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
      : body.message || "The request could not be completed.";
    throw new ApiError(response.status, message, body.correlationId);
  }
  return body;
}
