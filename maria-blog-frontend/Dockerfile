# Build context is the maria-blog repo root (deployed with -c fly.maria-blog-frontend.toml).
FROM node:22-alpine AS base

# ── Install dependencies ──
FROM base AS deps
WORKDIR /app
COPY maria-blog-frontend/package.json maria-blog-frontend/package-lock.json ./
RUN npm ci

# ── Build ──
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY maria-blog-frontend/ ./

# NEXT_PUBLIC_* are baked at build time — passed in as build args from the fly toml.
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Production image (Next standalone output) ──
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
