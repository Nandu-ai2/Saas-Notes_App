# Notes SaaS - Starter

This is a starter implementation of a multi-tenant Notes SaaS app (shared schema with tenant_id). It implements JWT auth, Admin/Member roles, Free/Pro plans, subscription gating (3-note limit for Free), and minimal frontend to login and manage notes.

## Quick start (local)

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and `JWT_SECRET`.
2. Create a Postgres database and run the SQL in `sql/schema.sql` (or use Supabase/Neon query editor).
3. Install deps:
   ```bash
   npm install
   ```
4. Seed test accounts:
   ```bash
   npm run seed
   ```
   Seeded accounts (password = `password`):
   - admin@acme.test (Admin)
   - user@acme.test (Member)
   - admin@globex.test (Admin)
   - user@globex.test (Member)

5. Run locally:
   ```bash
   npm run dev
   ```

6. Pages:
   - `/login` - login page
   - `/notes` - notes UI

## API endpoints (top-level via vercel rewrites)
- `GET /health` → `{ status: 'ok' }`
- `POST /auth/login` → `{ token }`
- `GET /notes` → list tenant notes (requires Authorization header)
- `POST /notes` → create note (enforces free plan limit)
- `GET /notes/:id` → get single note
- `PUT /notes/:id` → update note
- `DELETE /notes/:id` → delete note
- `POST /tenants/:slug/upgrade` → Admin-only endpoint to upgrade tenant to Pro (removes limit)

## Deployment (Vercel)
- Push repo to GitHub
- Create Vercel project and set environment variables:
  - DATABASE_URL
  - JWT_SECRET
- Deploy
- Run `scripts/seed.js` against your production DB (or seed via the DB UI)

## Tenancy approach
**Shared schema**: `tenant_id` column in `users` and `notes`. Every query filters by `tenant_id` derived from the JWT.

## Security notes
- Passwords are hashed using bcrypt.
- JWT contains `userId`, `tenantId`, and `role`.
- Always filter by `tenant_id` in queries to ensure isolation.
