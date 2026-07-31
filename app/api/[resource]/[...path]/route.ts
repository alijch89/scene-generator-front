import { NextRequest } from "next/server";

const allowedResources = new Set(["stories", "jobs", "storage", "admin"]);

async function forward(
  request: NextRequest,
  context: { params: Promise<{ resource: string; path: string[] }> },
) {
  const { resource, path } = await context.params;
  if (!allowedResources.has(resource)) {
    return Response.json({ message: "Not found" }, { status: 404 });
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
    const upstream = await fetch(
      `${backend}/api/v1/${resource}/${path.join("/")}${query}`,
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
      { message: "Story service is unavailable" },
      { status: 503 },
    );
  }
}

export const GET = forward;
export const POST = forward;
export const DELETE = forward;
export const PATCH = forward;
