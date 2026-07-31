import { NextRequest, NextResponse } from "next/server";

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

async function forward(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const endpoint = path.join("/");
  if (!allowedPaths.has(endpoint)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
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
      message: "Authentication service returned an invalid response",
    }));
    if (endpoint === "login" && upstream.ok) {
      payload = { message: "Signed in" };
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
      { message: "Authentication service is unavailable" },
      { status: 503 },
    );
  }
}

export const GET = forward;
export const POST = forward;
