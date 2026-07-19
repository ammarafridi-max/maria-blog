# maria-blog-frontend

Next.js (App Router) + Tailwind v4 site for Maria's physiotherapy blog.
Standalone (no monorepo). Has both a **public site** and an **admin dashboard**.

## What's here

### Public site (route group `src/app/(site)`)
- **Home** (`/`) — hero, highlights, latest posts, topic chips.
- **Blog** (`/blog`) — paginated post grid.
- **Post** (`/blog/[slug]`) — full article with quick answer, FAQ accordion, share
  buttons, related posts, and JSON-LD (`BlogPosting` + breadcrumbs).
- **Topics** (`/blog/tags`) and **topic detail** (`/blog/tags/[slug]`).

Shared public header/footer live in `src/app/(site)/layout.js`. Pages fetch published
content server-side and are ISR-cached.

### Admin dashboard (`src/app/admin`)
- **Admin auth** — `/admin/login`, cookie session, route guarding by role.
- **Blog** — list, create, edit, publish, schedule, duplicate, delete (`/admin/blog`).
  Rich-text editor (TinyMCE) with optional AI "Improve content" and "Generate cover".
- **Blog tags** — CRUD at `/admin/blog-tags`.
- **Admin users** — CRUD at `/admin/users` (admin only).
- **Account** — profile + password at `/admin/account`.
- **Dashboard** — post counts + recent posts at `/admin`.

Shared UI copied from the source design system lives flattened under
`src/{views,components,hooks,contexts,services}`. (The folder is `views/`, not
`pages/`, to avoid colliding with Next's Pages Router.)

Roles: `admin` and `blog-manager`.

## Setup

```bash
npm install
# .env.local already points NEXT_PUBLIC_BACKEND_URL at http://localhost:4000
npm run dev        # http://localhost:3000  → redirects to /admin
```

## Environment

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Base URL of maria-blog-backend (required) |
| `NEXT_PUBLIC_SITE_URL` | Public site origin, used for canonical URLs + JSON-LD (defaults to localhost) |
| `NEXT_PUBLIC_TINYMCE_API_KEY` | Optional — TinyMCE cloud key for the editor |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Optional analytics |

Run the backend first, seed an admin there, then log in here.
