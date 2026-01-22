This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Database Migrations

The project uses Supabase as the database. Migration files are in `supabase/migrations/`.

### Running migrations

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor
2. Open and run the migration file in order:

```bash
# 001: Add foreign key relationships (merchant_id, creator_id) to invoices table
supabase/migrations/001_add_foreign_keys.sql
```

Or using the Supabase CLI:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref <your-project-ref>

# Run migrations
supabase db push
```

### Migration details

**001_add_foreign_keys.sql**:
- Adds `merchant_id` (FK → merchants.id) and `creator_id` (FK → creators.id) to `invoices`
- Renames `merchant` column to `merchant_name_snapshot` (preserved as a historical snapshot)
- Migrates existing data by matching merchant names to IDs
- Creates indexes on the new FK columns
- Wrapped in a transaction for atomicity

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
