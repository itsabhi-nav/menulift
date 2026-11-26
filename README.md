# Menulift website

Next.js 16 + Tailwind 4. Marketing site, booking, quiz and admin panel.

## Run it (any computer)

Needs Node.js 20 or newer (https://nodejs.org).

```bash
npm install
npm run dev
```

Open http://localhost:3000

- **Admin:** http://localhost:3000/admin — password `menulift-local` (only when `ADMIN_PASSWORD` is not set).
- **Data:** bookings and enquiries are saved in `data/menulift.db`, created automatically. Delete the `data` folder to start clean.
- **Hindi:** `/hi`

No other setup, no database to install.

## Going live

Copy `.env.example` to `.env.local` and fill in what you need. On the live site set a strong
`ADMIN_PASSWORD` (10+ characters) and a `DATABASE_URL` (Postgres). Without `DATABASE_URL` it uses SQLite,
which does not persist on Netlify/Vercel.

Content lives in `src/lib/content.ts`.
