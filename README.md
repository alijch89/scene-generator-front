# Scene Generator web

Next.js 16 App Router frontend with dashboard, story creation, searchable
library, live generation status, story downloads/reader, billing, profile, and
the complete authentication flow. See the
[story module design](../docs/story-generation.md#8-nextjs-frontend).

## Security model

Client code calls only same-origin `/api/auth/*` route handlers. Those handlers
forward requests to NestJS and copy `Set-Cookie`. A successful backend login
body contains a session ID, but the BFF replaces it with a status message
before responding to the browser. No browser script can read the HttpOnly SID,
and access/refresh tokens never reach Next.js or the browser.

`proxy.ts` performs fast cookie-presence redirects for `/profile` and
`/change-password`; this is an optimistic UX check only. NestJS validates the
session and permissions. `AuthProvider` uses TanStack React Query for the
authenticated `GET /auth/me` server state. `apiFetch` deduplicates refresh
calls, rotates the backend tokens after a 401, and retries once. Reusable
controls in `components/ui` follow the shadcn/ui structure and use Tailwind.

## Setup

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Variables:

- `BACKEND_URL=http://localhost:3001` is server-only.
- `APP_ORIGIN=http://localhost:3000` must match backend `APP_ORIGIN`.
- `SESSION_COOKIE_NAME=sid` must match the backend. Use `__Host-sid` with HTTPS
  in production.

## Validation

```bash
npm run lint
npm run build
docker build -t scene-generator-frontend .
```

`GET /api/health` is the uncached frontend container liveness endpoint.

Never add token fields to auth context, local/session storage, query strings,
client-readable cookies, or analytics. Reset tokens necessarily arrive in the
one-time email link; they are unrelated to session JWTs and expire after use.
