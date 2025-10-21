This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Database Setup

This project uses PostgreSQL with Drizzle ORM. You can start with local development and migrate to Supabase when needed.

#### Option A: Local PostgreSQL (Recommended for Development)

**macOS (Postgres.app):**
1. Download and install [Postgres.app](https://postgresapp.com/)
2. Open Postgres.app and start the server
3. Click "Initialize" to create a new server (default port: 5432)
4. Open the built-in psql terminal or use any PostgreSQL client
5. Create your database:
   ```sql
   CREATE DATABASE "claude_next" WITH ENCODING 'UTF8';
   ```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE DATABASE claude_next;"
```

**Windows:**
1. Download [PostgreSQL installer](https://www.postgresql.org/download/windows/)
2. Run installer and note the password you set
3. Use pgAdmin or psql to create database:
   ```sql
   CREATE DATABASE claude_next;
   ```

**Configure environment:**
```bash
# .env
DATABASE_URL="postgresql://postgres@localhost:5432/claude_next"
```

**Run migrations:**
```bash
npm run db:push
```

#### Option B: Migrate to Supabase (Production & Team Collaboration)

**When to switch:**
- Deploying to production (Vercel, etc.)
- Need managed backups and scaling
- Team collaboration (shared database)
- Want built-in auth, storage, and realtime features

**Migration steps:**

1. **Create Supabase project:**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose organization, project name, database password, and region
   - Wait for project to initialize (~2 minutes)

2. **Get connection string:**
   - Go to Project Settings → Database
   - Under "Connection string", select **"Transaction"** mode (important for serverless)
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Update environment variables:**
   ```bash
   # .env (local development)
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"

   # For production (Vercel, etc.), add to environment variables
   ```

4. **Update database connection (if needed):**

   Only if using Supabase, update `lib/server/db/index.ts`:
   ```typescript
   // Add { prepare: false } for Supabase transaction pooler
   export const client = postgres(connectionString, { prepare: false })
   ```

5. **Run migrations:**
   ```bash
   npm run db:push
   ```

6. **Verify connection:**
   - Check Supabase dashboard → Database → Tables
   - You should see: `user`, `session`, `account`, `verification`

**Switching back to local:**
Simply update `DATABASE_URL` in `.env` and remove `{ prepare: false }` if you added it.

### 2. Authentication Setup

Generate a secret for BetterAuth:

```bash
# .env
BETTER_AUTH_SECRET="<generate-random-32+-char-string>"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

See [CLAUDE.md](../../CLAUDE.md#authentication) for complete authentication documentation, including email service integration and production deployment.

### 3. Start Development Server

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
