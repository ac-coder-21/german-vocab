This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database

Data is stored in Postgres (via `pg`). Set `POSTGRES_URL` (or `DATABASE_URL`) to a
connection string before running the app — the schema and dummy word sets are
created automatically on first request.

- **Local dev**: copy `.env.local.example` to `.env.local` and fill in a
  connection string (e.g. a free [Neon](https://neon.tech) project, or any
  local Postgres instance).
- **Vercel**: add a Postgres database from the project's Storage tab
  (Neon-backed). Vercel injects `POSTGRES_URL` automatically for deployed
  environments; run `vercel env pull .env.local` to get the same value
  locally.

## Authentication

The whole app sits behind a login (`proxy.ts`). Accounts are created by you,
not via public signup:

```bash
npm run create-user -- someone@example.com "a strong password"
```

This requires two environment variables, both in `.env.local` for local dev
and in your Vercel project's env vars for deployment:

- `POSTGRES_URL` — see [Database](#database) above; the script creates the
  `users` table itself if it doesn't exist yet.
- `SESSION_SECRET` — a 32+ character random string used to sign session
  cookies. Generate one with:

  ```bash
  openssl rand -base64 32
  ```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
