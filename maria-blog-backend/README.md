# maria-blog-backend

Express 5 + Mongoose 9 API for Maria's physiotherapy blog. Standalone (no monorepo).
Scope: **admin auth, admin users, blogs, and blog tags** only.

## Architecture

Each domain lives under `src/domains/<name>` as a self-contained factory
(`schema → service → controller → router`, stitched by `index.js`) and is wired
in the composition root at `src/routes/index.js`. Nothing imports a DB connection
or env directly — dependencies (`db`, `auth`, `imageStorage`, `anthropicApiKey`)
are injected.

```
src/
  server.js, app.js, config.js
  lib/        db.js · errors.js (AppError/catchAsync) · logger.js · cloudinary.js
  domains/
    auth/         login/logout/me + JWT cookie + protect/restrictTo middleware
    admin-users/  admin CRUD, self-service profile & password
    blog/         blogs (+ AI assist) and blog tags
  routes/index.js   composition root: /auth, /admin-users, /blogs, /blog-tags
scripts/seed-admin.js
```

Roles: `admin` (full access) and `blog-manager` (blog + tags only).

## Setup

```bash
npm install
# edit .env.development — set MONGO_URI, a long JWT_SECRET, and Cloudinary keys
npm run seed-admin:dev        # creates the first admin (Maria)
npm run dev                   # node --env-file=.env.development --watch src/server.js
```

Default seeded credentials (override with `SEED_*` env vars): `maria@example.com` / `Admin1234`.
**Change the password after first login.**

## Environment

| Var | Purpose |
|-----|---------|
| `MONGO_URI` | MongoDB connection string (required) |
| `JWT_SECRET` | Long random string for signing admin JWTs (required) |
| `CORS_ORIGINS` | Comma-separated allowed origins (frontend URL) |
| `CLOUDINARY_*` | Required for blog cover-image uploads |
| `ANTHROPIC_API_KEY` | Optional — enables the "Improve content" AI editor |
| `RECRAFT_API_KEY` | Optional — enables the "Generate cover" AI image |

The two AI endpoints return `503` until their keys are set; everything else works without them.

## API surface

- `POST /api/auth/login` · `GET|POST /api/auth/logout` · `GET|PATCH /api/auth/me` · `PATCH /api/auth/update-password`
- `/api/admin-users` (admin-only CRUD) · `/api/admin-users/me` (self)
- `/api/blogs` (public list + slug), `/api/blogs/admin/list` and mutations (admin/blog-manager)
- `/api/blog-tags` (public list/slug), mutations (admin/blog-manager)
