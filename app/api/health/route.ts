import { NextResponse } from "next/server";

/** Prevents caching so each liveness response reflects the current process. */
export const dynamic = "force-dynamic";

/**
 * Reports process liveness for the Next.js web service.
 *
 * @returns Uncached JSON containing service identity, time, and process uptime.
 */
export function GET() {
  return NextResponse.json(
    {
      status: "up",
      service: "scene-generator-web",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
