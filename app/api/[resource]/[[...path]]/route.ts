import { NextRequest } from "next/server";

/** Backend resource roots exposed by the general same-origin proxy. */
const allowedResources = new Set(["stories", "jobs", "storage", "admin"]);

/**
 * Forwards an allow-listed resource request to the NestJS API.
 *
 * Security:
 * The route rejects unknown resource roots, reconstructs the trusted backend
 * origin, forwards only selected headers, disables caching, and relies on the
 * backend for session authentication, authorization, DTO validation, and
 * ownership checks. It streams responses so SSE and asset downloads remain
 * usable without buffering.
 *
 * @returns Streaming upstream response, HTTP 404 for disallowed resources, or
 * HTTP 503 when the backend cannot be reached before its timeout.
 */
async function forward(
  request: NextRequest,
  context: { params: Promise<{ resource: string; path?: string[] }> },
) {
  const { resource, path = [] } = await context.params;
  if (!allowedResources.has(resource)) {
    return Response.json(
      { message: "مسیر درخواستی یافت نشد." },
      { status: 404 },
    );
  }
  const backend = process.env.BACKEND_URL ?? "http://localhost:3001";
  const appOrigin = process.env.APP_ORIGIN ?? "http://localhost:3000";
  const query = request.nextUrl.search;
  const headers = new Headers({
    accept: request.headers.get("accept") ?? "application/json",
    origin: appOrigin,
    "x-forwarded-for":
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "",
    "user-agent": request.headers.get("user-agent") ?? "",
  });
  for (const name of ["cookie", "content-type", "x-correlation-id"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const hasBody = !["GET", "HEAD"].includes(request.method);
  try {
    const suffix = path.length ? `/${path.join("/")}` : "";
    const upstream = await fetch(
      `${backend}/api/v1/${resource}${suffix}${query}`,
      {
        method: request.method,
        headers,
        body: hasBody ? await request.arrayBuffer() : undefined,
        cache: "no-store",
        signal: AbortSignal.timeout(
          request.headers.get("accept") === "text/event-stream"
            ? 86_400_000
            : 30_000,
        ),
      },
    );
    const responseHeaders = new Headers();
    for (const name of [
      "content-type",
      "content-length",
      "content-disposition",
      "cache-control",
      "x-correlation-id",
    ]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { message: "سرویس داستان موقتاً در دسترس نیست." },
      { status: 503 },
    );
  }
}

/** Handles proxied read and streaming requests. */
export const GET = forward;
/** Handles proxied create/action requests. */
export const POST = forward;
/** Handles proxied deletion requests. */
export const DELETE = forward;
/** Handles proxied partial-update requests. */
export const PATCH = forward;
