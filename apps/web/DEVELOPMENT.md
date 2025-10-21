# Development Guide

Quick reference for developing with this Next.js 15 starter.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Update .env with your database URL and secrets

# Push database schema
npm run db:push

# Start dev server
npm run dev
```

## Common Tasks

### Add a New Page

1. Create route directory: `app/[route]/page.tsx`
2. Add metadata:
```tsx
export const metadata = {
  title: "Page Title",
  description: "Page description",
}
```

### Add Protected Route

Create `layout.tsx` in route with forced dynamic rendering:
```tsx
import { redirect } from "next/navigation"
import { auth } from "@/lib/server/auth"
import { headers } from "next/headers"

// ⚠️ Critical: Force dynamic for fresh auth checks
export const dynamic = "force-dynamic"

export default async function Layout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) redirect("/auth/signin")
  return <>{children}</>
}
```

**Important:** Always use server layouts for auth, NOT middleware.

### Add Server Action

Create in `lib/actions/[feature].ts`:
```tsx
"use server"

import { db } from "@/lib/server/db"
import { revalidatePath } from "next/cache"

export async function myAction(data: unknown) {
  // 1. Validate with Zod
  // 2. Perform action
  // 3. Revalidate paths
  // 4. Return result
}
```

### Add Database Table

1. Create schema: `lib/server/db/schema/[table].ts`
2. Export from `schema/index.ts`
3. Run: `npm run db:push`

### Add Component

- **Server Component** (default): No `"use client"`
- **Client Component** (interactive): Add `"use client"` at top

## Key Patterns

### Data Fetching
```tsx
// Server Component
export default async function Page() {
  const data = await db.query.table.findMany()
  return <div>{data}</div>
}
```

### Forms
```tsx
"use client"

import { myAction } from "@/lib/actions/feature"

function Form() {
  async function handleSubmit(e) {
    e.preventDefault()
    const result = await myAction(formData)
    if (result.success) {
      router.push("/success")
    }
  }
  return <form onSubmit={handleSubmit}>...</form>
}
```

## File Structure

```
app/                    Routes
  [route]/
    page.tsx           Page component
    layout.tsx         Layout (optional)
    loading.tsx        Loading state
    error.tsx          Error boundary

lib/
  server/              Server-only code
    db/                Database
    auth.ts            Auth config
  actions/             Server actions
  utils.ts             Utilities

components/
  ui/                  shadcn/ui components
  [feature]/           Feature components
```

## Important Commands

```bash
npm run dev              # Development server
npm run build            # Production build
npm run type-check       # TypeScript check
npm run lint             # ESLint

npm run db:push          # Push schema (dev)
npm run db:generate      # Generate migration
npm run db:studio        # Open Drizzle Studio
```

## Environment Variables

Required in `.env`:
```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="random-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

## Best Practices

- ✅ Server Components by default
- ✅ Client Components only when needed
- ✅ Type everything with TypeScript
- ✅ Validate with Zod
- ✅ Use Tailwind classes
- ✅ Add loading and error states
- ✅ Use server actions for mutations

## Getting Help

- See `/CLAUDE.md` for comprehensive guide
- Use Claude Skills: `/add-feature`, `/add-component`, `/add-db-table`
- Check Next.js docs: https://nextjs.org/docs
- Check Drizzle docs: https://orm.drizzle.team
