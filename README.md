# The Trail Makers Next App

Production-focused Next.js 16 application for trekking discovery, bookings, expeditions, courses, FAQs, and role-based admin operations.

## Stack

- Next.js 16 App Router
- React 19
- Prisma with PostgreSQL
- NextAuth credentials authentication
- Tailwind CSS
- Sentry monitoring

## Core Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run db:generate
npm run db:push
npm run db:seed
```

## Required Environment Variables

```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_SITE_URL=
RESEND_API_KEY=
EMAIL_FROM=
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

`NEXT_PUBLIC_SITE_URL` should point to the canonical deployment URL and is used for metadata generation.

## Database Workflow

1. Generate the Prisma client with `npm run db:generate`.
2. Apply the current schema with `npm run db:push`.
3. Seed base content with `npm run db:seed`.

The canonical seed entrypoint is Prisma's configured seed command, which runs `prisma/seed.ts`.

## Application Areas

- Public marketing and catalog routes under `src/app`
- Booking, payment, and profile flows under `src/app/booking` and `src/app/profile`
- Admin APIs and dashboards under `src/app/admin` and `src/app/api/admin`
- Shared business logic under `src/lib/services`
- Auth and RBAC logic under `src/lib/auth.ts`, `src/lib/roleUtils.ts`, and `src/proxy.ts`

## Architectural Conventions

- Prefer server-rendered route pages for catalog and content sections.
- Use client components only for interactive islands.
- Route protection lives in `src/proxy.ts` for this Next 16 branch.
- Use the shared Prisma singleton from `src/lib/prisma.ts`.
- Use `next/image` for application images.
- Add `loading.tsx` and `error.tsx` boundaries for routes with significant server work.

## Validation

Before merging substantial changes, run:

```bash
npm run lint
npm run build
```

## Notes

- The build is resilient when `DATABASE_URL` is missing by catching database access for static generation paths and falling back to empty collections where needed.
- Sentry is configured through `next.config.mjs` and the `sentry.*.config.ts` files.
