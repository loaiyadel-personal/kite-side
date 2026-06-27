# Kite Side — Hosting Checklist

Production readiness checklist for deploying the Kite Side beach club app.
Stack: Next.js 14 frontend · Express/TypeScript backend · Railway PostgreSQL.

---

## 0. Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 20 LTS |
| npm | ≥ 10 |
| PostgreSQL | 15 or 16 (Railway provides this) |

---

## 1. Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | **YES** | Railway → Settings → Database URL (postgres://…) |
| `JWT_SECRET` | **YES** | `openssl rand -hex 32` — store in Railway secrets, never commit |
| `JWT_EXPIRES_IN` | no | default `8h` |
| `PORT` | no | Railway sets this automatically; default `4000` |
| `NODE_ENV` | **YES** | `production` |
| `PRODUCTION_URL` | **YES** | Exact frontend origin, e.g. `https://kiteside.com` — used for CORS allow-list |
| `SMTP_HOST` | **YES** | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | **YES** | `587` (TLS) or `465` (SSL) |
| `SMTP_USER` | **YES** | Gmail address or sending address |
| `SMTP_PASS` | **YES** | Gmail → Google Account → Security → App Passwords |
| `ADMIN_EMAIL` | **YES** | Contact-form notifications go here |
| `ADMIN_URL` | **YES** | Admin panel URL in notification emails, e.g. `https://kiteside.com` |

### Frontend (`frontend/.env`)

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | **YES** | Full backend API URL with `/api` suffix, e.g. `https://api.kiteside.com/api` |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical site URL for og tags |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | no | `201116407080` (no + prefix) |
| `NEXT_PUBLIC_WINDFINDER_SPOT_ID` | no | Windfinder spot slug, e.g. `ras-sudr` |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | no | Only needed if switching from embed to JS Maps API |

> **Important — CSP:** If `NEXT_PUBLIC_API_URL` is on a different domain than the frontend
> (e.g. `api.kiteside.com` vs `kiteside.com`), update the `connect-src` and `img-src` directives
> in `frontend/next.config.js` to include that API origin. The variable `apiOrigin` is derived
> automatically from `NEXT_PUBLIC_API_URL` — verify it resolves correctly after deploy.

---

## 2. First-Deploy Order of Operations

### Step 1 — Deploy the backend first

```bash
cd backend
npm ci
npm run build            # tsc → dist/
npx prisma generate      # generates the Prisma Client from schema.prisma
npx prisma db push       # creates/syncs all tables (no shadow DB needed)
npm start                # node dist/index.js
```

> **Do NOT use `prisma migrate dev`** in production — it requires shadow DB creation
> permissions that Railway's managed user does not have. Use `prisma db push` for all
> schema changes.

### Step 2 — Create the first admin user

```bash
cd backend
# Seed the super-admin user (check database/seeds/index.ts for credentials)
npx ts-node database/seeds/index.ts
```

Change the seeded password immediately after first login.

### Step 3 — Deploy the frontend

```bash
cd frontend
npm ci
npm run build            # next build → .next/
npm start                # next start (port 3000)
```

### Step 4 — Verify

- `GET /api/health` → `{ "status": "ok" }`
- Admin login at `/admin/login`
- Public site loads at `/`
- Image uploads work and URLs resolve correctly

---

## 3. Uploads / File Storage

The backend writes uploaded images to `backend/uploads/`. In production this directory
**must persist across deploys** — configure a persistent volume or object storage.

- **Railway:** Add a volume mounted at `/app/uploads`.
- **Docker / VPS:** Bind-mount `./backend/uploads:/app/uploads` (already in `docker-compose.yml`).

If `uploads/` is ephemeral, all uploaded images will be lost on redeploy.

---

## 4. Build & Start Commands (by platform)

### Railway

| Service | Build command | Start command |
|---|---|---|
| Backend | `npm ci && npm run build && npx prisma generate && npx prisma db push` | `npm start` |
| Frontend | `npm ci && npm run build` | `npm start` |

### Docker Compose (self-hosted)

```bash
docker compose up --build -d
```

> Note: `docker-compose.yml` contains `JWT_SECRET: change_me_in_production` — override this
> with a real secret via an `.env` file or Docker secrets before running in production.

---

## 5. Known Operational Notes

| Item | Detail |
|---|---|
| **Session persistence** | The backend uses an in-memory token blocklist for logout/revocation. This resets on server restart — logged-out sessions that haven't expired will become valid again after a redeploy. Acceptable for current scale; replace with Redis if stricter revocation is needed. |
| **morgan logging** | Currently uses `morgan('dev')` which logs to stdout in colour. Harmless but verbose in production. Switch to `morgan('combined')` for standard Apache-format logs if feeding into a log aggregator. |
| **Rate limits** | Global: 200 req / 15 min. Auth login: 10 req / hour. Contact form: 20 req / hour. Adjust in `backend/src/index.ts` if you add Cloudflare or a CDN in front. |
| **CORS** | `PRODUCTION_URL` must be the exact frontend origin (no trailing slash). Two local origins (`localhost:3000`, `localhost:3001`) are always allowed regardless of `NODE_ENV`. |
| **CSP** | Security headers (including CSP) are production-only in `next.config.js`. They do not apply in development so that webpack HMR works. |
| **`next` in backend deps** | `next` appears in `backend/package.json` as an accidental side-effect of an `npm audit fix` run during setup. It is unused by the backend; remove it before production to keep the image lean: `npm uninstall next` inside `backend/`. |

---

## 6. Pre-launch Checklist

- [ ] `JWT_SECRET` is ≥ 32 random characters, not the dev placeholder
- [ ] `DATABASE_URL` points to the production database
- [ ] `PRODUCTION_URL` matches the exact deployed frontend origin
- [ ] `SMTP_*` credentials are valid and test email is received
- [ ] `uploads/` directory is on a persistent volume
- [ ] `npx prisma db push` ran successfully with `0 errors`
- [ ] `/api/health` returns `{ "status": "ok" }`
- [ ] Admin login works and redirects correctly
- [ ] Contact form submission sends a notification email
- [ ] Image uploads in admin panel resolve correctly on the public site
- [ ] HTTPS is terminated at the proxy/CDN (Railway handles this automatically)
- [ ] Seeded super-admin password has been changed
- [ ] `next` removed from backend `package.json` (cleanup)
