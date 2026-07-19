# Build context is the maria-blog repo root (deployed with -c fly.maria-blog-backend.toml).
FROM node:22-slim AS base
WORKDIR /app

# ── Install production dependencies (cached separately from source) ──
FROM base AS deps
COPY maria-blog-backend/package.json maria-blog-backend/package-lock.json ./
RUN npm ci --omit=dev

# ── Runtime image ──
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=deps /app/node_modules ./node_modules
COPY maria-blog-backend/package.json ./
COPY maria-blog-backend/src ./src
COPY maria-blog-backend/scripts ./scripts

EXPOSE 3001
# Env comes from Fly secrets (not an .env file), so no --env-file here.
CMD ["node", "src/server.js"]
