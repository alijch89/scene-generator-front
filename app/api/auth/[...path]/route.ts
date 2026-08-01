import { NextRequest, NextResponse } from "next/server";

/** Authentication endpoint paths exposed through the web application origin. */
const allowedPaths = new Set([
  "register",
  "login",
  "refresh",
  "logout",
  "logout-all",
  "forgot-password",
  "reset-password",
  "change-password",
  "me",
]);

/**
 * Forwards an allow-listed authentication request to the NestJS API.
 *
 * Security:
 * The handler supplies the trusted application origin required by the backend
 * CSRF guard, forwards only cookie/correlation/client-attribution headers, never
 * returns a login session ID to browser JavaScript, and relays hardened
 * `Set-Cookie` headers verbatim. Responses are never cached.
 *
 * @returns Sanitized upstream JSON, HTTP 404 for disallowed paths, or HTTP 503
 * after the ten-second backend timeout.
 */
async function forward(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const endpoint = path.join("/");
  if (!allowedPaths.has(endpoint)) {
    return NextResponse.json(
      { message: "مسیر درخواستی یافت نشد." },
      { status: 404 },
    );
  }
  const backend = process.env.BACKEND_URL ?? "http://localhost:3001";
  const appOrigin = process.env.APP_ORIGIN ?? "http://localhost:3000";
  const headers = new Headers({
    accept: "application/json",
    origin: appOrigin,
    "x-forwarded-for":
      request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "",
    "user-agent": request.headers.get("user-agent") ?? "",
  });
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  const correlationId = request.headers.get("x-correlation-id");
  if (correlationId) headers.set("x-correlation-id", correlationId);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.text() : undefined;
  if (body) headers.set("content-type", "application/json");

  try {
    const upstream = await fetch(`${backend}/api/v1/auth/${endpoint}`, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    let payload: unknown = await upstream.json().catch(() => ({
      message: "پاسخ سرویس احراز هویت معتبر نیست.",
    }));
    if (endpoint === "login" && upstream.ok) {
      payload = { message: "با موفقیت وارد حساب کاربری شدید." };
    }
    const response = NextResponse.json(payload, { status: upstream.status });
    for (const value of upstream.headers.getSetCookie()) {
      response.headers.append("set-cookie", value);
    }
    const upstreamCorrelation = upstream.headers.get("x-correlation-id");
    if (upstreamCorrelation) {
      response.headers.set("x-correlation-id", upstreamCorrelation);
    }
    response.headers.set("cache-control", "no-store");
    return response;
  } catch {
    return NextResponse.json(
      { message: "سرویس احراز هویت موقتاً در دسترس نیست." },
      { status: 503 },
    );
  }
}

/** Handles proxied profile reads. */
export const GET = forward;
/** Handles proxied authentication mutations. */
export const POST = forward;
