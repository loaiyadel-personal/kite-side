# Kite Side — Ras Sudr, Egypt

Official website for **Kite Side**, a certified IKO kitesurfing center and restaurant in Ras Sudr, Egypt.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Email | Nodemailer (SMTP) |
| Storage | Local / S3-compatible |
| Auth | JWT (admin panel) |
| Wind data | Windfinder API (public embed) |
| Maps | Google Maps Embed API |
| Analytics | Custom (first-party, no cookies) |

## Project Structure

```
kite-side/
├── frontend/          # Next.js 14 app
│   ├── public/        # Static assets (images, icons)
│   └── src/
│       ├── app/       # Pages (App Router)
│       │   ├── (public)/   # Public-facing pages
│       │   └── admin/      # Admin panel pages
│       ├── components/     # React components by domain
│       ├── lib/            # API clients, hooks, utilities
│       ├── styles/         # Global CSS
│       └── types/          # TypeScript types
├── backend/           # Express REST API
│   └── src/
│       ├── routes/         # API route definitions
│       ├── controllers/    # Request handlers
│       ├── models/         # Prisma models / DB queries
│       ├── middleware/     # Auth, validation, rate-limit
│       └── services/       # Email, analytics, file storage
├── database/
│   ├── migrations/    # Prisma migrations
│   └── seeds/         # Seed data (menu, courses, pricing)
└── docker-compose.yml # Local dev environment
```

## Getting Started

```bash
# 1. Clone
git clone <repo-url>
cd kite-side

# 2. Install dependencies
cd frontend && npm install
cd ../backend && npm install

# 3. Configure environment
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# 4. Start dev environment
docker-compose up -d   # starts PostgreSQL
cd backend && npm run dev
cd frontend && npm run dev
```

## Epics

| # | Epic | Status |
|---|---|---|
| 1 | Public homepage (hero, wind widget, map) | 🔲 |
| 2 | Gallery — photos & videos | 🔲 |
| 3 | Restaurant menu | 🔲 |
| 4 | Courses & pricing | 🔲 |
| 5 | Contact us (form + email) | 🔲 |
| 6 | Admin panel (CMS + analytics + users) | 🔲 |
| 7 | Shop & beach pricing | 🔲 |
| 8 | SEO & performance | 🔲 |

## Contact

**Kite Side** · Ras Sudr, Egypt  
📞 +20 11 16407080  
📧 Ahmedyehya47@gmail.com  
🌍 [Instagram](https://instagram.com/kite_side) · [Facebook](https://facebook.com/p/Kite-Side-100093408729310)
