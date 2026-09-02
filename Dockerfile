# syntax=docker/dockerfile:1

# Next.js 16 frontend, built to `output: "standalone"` so the runtime stage
# carries a server.js plus only the traced dependencies.

ARG NODE_VERSION=22-alpine

# --- deps -------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
# Both lockfiles were resolved on a host whose ~/.npmrc sets
# legacy-peer-deps=true. npm defaults it to false, which computes a different
# tree and makes `npm ci` reject the lockfile, so reproduce the setting here.
ENV NPM_CONFIG_LEGACY_PEER_DEPS=true
COPY package.json package-lock.json ./
RUN npm ci

# --- build ------------------------------------------------------------------
FROM node:${NODE_VERSION} AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* is inlined into the client bundle, so these are build-time
# inputs, not runtime env. They must hold URLs a *browser* can reach; the
# server's own path to the API is INTERNAL_API_URL, set at runtime.
ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api
ARG NEXT_PUBLIC_S3_URL=http://localhost:9000/shahrzad
ARG NEXT_PUBLIC_PAYMENT_MODE=mock
ARG NEXT_PUBLIC_SITE_URL=
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_S3_URL=${NEXT_PUBLIC_S3_URL} \
    NEXT_PUBLIC_PAYMENT_MODE=${NEXT_PUBLIC_PAYMENT_MODE} \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# app/layout.tsx pulls Vazirmatn and Baloo through next/font/google, so this
# step needs network access to fonts.googleapis.com.
RUN npm run build

# --- runtime ----------------------------------------------------------------
FROM node:${NODE_VERSION} AS runtime
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app

# The standalone bundle omits both of these on purpose; they are copied back
# into the exact paths server.js expects.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=6 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/" >/dev/null || exit 1

CMD ["node", "server.js"]
