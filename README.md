# Maria Blog

A physiotherapy blog by Maria, with a public site and an admin dashboard.

- **[maria-blog-frontend](./maria-blog-frontend)** — Next.js (App Router) + Tailwind v4. Public site (`/`, `/blog`, `/blog/[slug]`, `/blog/tags`) plus an admin dashboard at `/admin`.
- **[maria-blog-backend](./maria-blog-backend)** — Express 5 + Mongoose 9 API for admin auth, admin users, blogs, and blog tags.

## Getting started

```bash
# Backend
cd maria-blog-backend
cp .env.example .env.development   # fill in MONGO_URI, JWT_SECRET, Cloudinary keys
npm install
npm run seed-admin:dev             # create the first admin
npm run dev                        # http://localhost:3001

# Frontend
cd ../maria-blog-frontend
cp .env.example .env.local         # points at the backend by default
npm install
npm run dev                        # http://localhost:3000
```

## Secrets

Real credentials live only in `.env*` files, which are gitignored. Never commit them.
Each app ships a `.env.example` documenting the variables it needs. There is also a
Postman collection at `maria-blog-backend/postman/` for testing the API.
