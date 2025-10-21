# Claude Code Development Guide

This document provides comprehensive guidelines for working with this Next.js 15 starter. Follow these practices when adding new features, components, and functionality.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Principles](#architecture-principles)
- [Adding Features](#adding-features)
- [Component Patterns](#component-patterns)
- [Data Fetching](#data-fetching)
- [Authentication](#authentication)
- [API & Server Actions](#api--server-actions)
- [Database](#database)
- [Styling](#styling)
- [TypeScript](#typescript)
- [Testing](#testing)
- [Common Patterns](#common-patterns)

## Project Overview

This is a **Turborepo monorepo** with Next.js 15 App Router, optimized for full-stack development.

### Stack
- **Next.js 15** - App Router, React Server Components, React 19
- **TypeScript** - Strict mode, type-safe end-to-end
- **Tailwind CSS v4** - Utility-first styling with CSS variables
- **shadcn/ui** - Accessible component library
- **BetterAuth** - Modern authentication
- **Drizzle ORM** - Type-safe database access
- **Turborepo** - Monorepo build system
- **Zod** - Schema validation

### Directory Structure

```
apps/web/
├── app/                    # App Router (routing, pages, layouts)
│   ├── (routes)/          # Route groups (optional)
│   ├── api/               # API route handlers
│   └── [dynamic]/         # Dynamic routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── shared/            # Shared components (server & client)
│   └── [feature]/         # Feature-specific components
├── lib/
│   ├── server/            # Server-only code
│   │   ├── db/           # Database schemas and queries
│   │   └── auth.ts       # Server auth configuration
│   ├── actions/           # Server actions (mutations)
│   ├── utils.ts           # Shared utilities
│   └── env.ts             # Environment validation
└── public/                # Static assets
```

## Architecture Principles

### 1. Server Components by Default

**Always start with Server Components.** Only use Client Components when you need:
- Interactivity (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, etc.)
- Context providers

```tsx
// ✅ Server Component (default)
export default async function UserProfile({ userId }: { userId: string }) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  return <div>{user.name}</div>
}

// ✅ Client Component (when needed)
"use client"

export function UserProfileForm() {
  const [name, setName] = useState("")

  return <input value={name} onChange={(e) => setName(e.target.value)} />
}
```

### 2. Co-location

Keep related code together in feature folders:

```
app/dashboard/
├── layout.tsx              # Dashboard layout
├── page.tsx                # Dashboard page
├── loading.tsx             # Loading UI
├── error.tsx               # Error boundary
└── components/             # Dashboard-specific components
    ├── stats-card.tsx
    └── chart.tsx
```

### 3. Type Safety

Use TypeScript strictly:
- Enable `strict: true` in tsconfig.json
- Use Zod for runtime validation
- Define explicit types for all props and functions
- Use `satisfies` for config objects

### 4. Performance First

- Minimize client-side JavaScript
- Fetch data in Server Components
- Use streaming with Suspense
- Implement proper caching strategies

## Adding Features

### Step 1: Plan the Feature

1. Identify required routes
2. Determine data needs
3. Plan component hierarchy
4. Design database schema (if needed)

### Step 2: Create Route Structure

```bash
# Example: Adding a blog feature
mkdir -p app/blog
touch app/blog/page.tsx
touch app/blog/[slug]/page.tsx
touch app/blog/loading.tsx
touch app/blog/error.tsx
```

### Step 3: Add Database Schema (if needed)

```typescript
// lib/server/db/schema/posts.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const posts = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull().unique(),
  published: boolean("published").default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const insertPostSchema = createInsertSchema(posts)
export const selectPostSchema = createSelectSchema(posts)

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
```

Don't forget to export from `schema/index.ts`:

```typescript
// lib/server/db/schema/index.ts
export * from "./users"
export * from "./posts"  // Add this
```

### Step 4: Create Server Actions

```typescript
// lib/actions/posts.ts
"use server"

import { db } from "@/lib/server/db"
import { posts, insertPostSchema } from "@/lib/server/db/schema"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function createPost(data: z.infer<typeof insertPostSchema>) {
  try {
    // Validate input
    const validated = insertPostSchema.parse(data)

    // Insert into database
    const [post] = await db.insert(posts).values(validated).returning()

    // Revalidate affected pages
    revalidatePath("/blog")

    return { success: true, post }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post"
    }
  }
}
```

### Step 5: Create Components

```tsx
// app/blog/components/post-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPost } from "@/lib/actions/posts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PostForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createPost({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      slug: formData.get("slug") as string,
    })

    if (result.success) {
      router.push(`/blog/${result.post.slug}`)
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input name="title" placeholder="Title" required />
      <Input name="slug" placeholder="slug" required />
      <textarea name="content" placeholder="Content" required />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Post"}
      </Button>
    </form>
  )
}
```

## Component Patterns

### Server Component Pattern

```tsx
// Server Component - default, no "use client"
interface PageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogPost({ params, searchParams }: PageProps) {
  // Fetch data directly in component
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, params.slug),
  })

  if (!post) {
    notFound()
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, params.slug),
  })

  return {
    title: post?.title,
    description: post?.content.slice(0, 160),
  }
}
```

### Client Component Pattern

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface InteractiveButtonProps {
  initialCount?: number
  children: React.ReactNode
}

export function InteractiveButton({
  initialCount = 0,
  children
}: InteractiveButtonProps) {
  const [count, setCount] = useState(initialCount)

  return (
    <Button onClick={() => setCount(count + 1)}>
      {children} ({count})
    </Button>
  )
}
```

### Composition Pattern (Server + Client)

```tsx
// app/blog/page.tsx (Server Component)
import { db } from "@/lib/server/db"
import { PostList } from "./components/post-list"

export default async function BlogPage() {
  const posts = await db.query.posts.findMany({
    where: eq(posts.published, true),
    orderBy: desc(posts.createdAt),
  })

  // Pass server data to client component
  return <PostList posts={posts} />
}

// app/blog/components/post-list.tsx (Client Component)
"use client"

import { useState } from "react"
import type { Post } from "@/lib/server/db/schema"

export function PostList({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState("")

  const filtered = posts.filter(post =>
    post.title.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter posts..."
      />
      {filtered.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

## Data Fetching

### Patterns

#### 1. Parallel Data Fetching

```tsx
export default async function Dashboard() {
  // Fetch in parallel
  const [users, posts, stats] = await Promise.all([
    db.query.users.findMany(),
    db.query.posts.findMany(),
    getStats(),
  ])

  return (
    <div>
      <UsersList users={users} />
      <PostsList posts={posts} />
      <Stats data={stats} />
    </div>
  )
}
```

#### 2. Sequential Data Fetching (when dependent)

```tsx
export default async function UserPosts({ params }: { params: { id: string } }) {
  // First, get user
  const user = await db.query.users.findFirst({
    where: eq(users.id, params.id),
  })

  if (!user) notFound()

  // Then get their posts (depends on user existing)
  const userPosts = await db.query.posts.findMany({
    where: eq(posts.userId, user.id),
  })

  return (
    <div>
      <h1>{user.name}'s Posts</h1>
      {userPosts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  )
}
```

#### 3. Streaming with Suspense

```tsx
import { Suspense } from "react"
import { PostsList } from "./components/posts-list"
import { PostsLoading } from "./components/posts-loading"

export default function BlogPage() {
  return (
    <div>
      <h1>Blog</h1>
      <Suspense fallback={<PostsLoading />}>
        <PostsList />
      </Suspense>
    </div>
  )
}

// Separate async component
async function PostsList() {
  const posts = await db.query.posts.findMany()
  return <div>{/* render posts */}</div>
}
```

### Caching Strategies

```tsx
// Static - cached indefinitely (default)
export default async function StaticPage() {
  const data = await fetch("https://api.example.com/data")
  return <div>{data}</div>
}

// Revalidate every 60 seconds
export const revalidate = 60

export default async function RevalidatedPage() {
  const data = await fetch("https://api.example.com/data")
  return <div>{data}</div>
}

// Dynamic - no caching
export const dynamic = "force-dynamic"

export default async function DynamicPage() {
  const data = await fetch("https://api.example.com/data", {
    cache: "no-store"
  })
  return <div>{data}</div>
}
```

## Authentication

### ⚠️ Critical: Use Server Layouts, NOT Middleware

**Server layouts are the recommended pattern for authentication in Next.js 15 App Router.**

Why server layouts over middleware:
- ✅ Execute on the same request as the page (no extra hops)
- ✅ Full TypeScript support and type inference
- ✅ Access to all server component features (SSR, streaming, Suspense)
- ✅ Can render UI and compose with data fetching
- ✅ Co-located with protected routes (no drift-prone path lists)
- ❌ Middleware cannot render, requires path matchers, and adds complexity

### ❌ Anti-Pattern: Middleware-Based Auth (DON'T DO THIS)

**This is the OLD, INCORRECT pattern that should be avoided:**

```tsx
// ❌ DO NOT DO THIS - Old middleware-based pattern
// middleware.ts
export function middleware(request: NextRequest) {
  const session = getSession()
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*']
}
```

**Problems with this approach:**
- ❌ Cannot render UI or show loading states
- ❌ Requires maintaining drift-prone path lists in matcher config
- ❌ Adds extra network hops (middleware → redirect → page)
- ❌ Limited TypeScript support and type inference
- ❌ Cannot compose with data fetching
- ❌ Harder to test and debug

### Protecting Routes with Server Layouts

**Always force dynamic rendering in auth layouts** to ensure fresh auth checks on every request:

```tsx
// app/dashboard/layout.tsx
import { redirect } from "next/navigation"
import { auth } from "@/lib/server/auth"
import { headers } from "next/headers"

// ⚠️ CRITICAL: Force dynamic rendering for auth
export const dynamic = "force-dynamic"
// Alternative: export const revalidate = 0

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div>
      <DashboardNav user={session.user} />
      {children}
    </div>
  )
}
```

### Role-Based Access with Route Groups

Use route groups `(name)` to organize routes by role without affecting URLs:

```
app/
├── (auth)/              # Public routes
│   ├── signin/
│   └── signup/
├── (app)/               # Base authenticated routes
│   ├── layout.tsx       # Auth gate
│   ├── dashboard/
│   └── settings/
└── (admin)/             # Admin-only routes
    ├── layout.tsx       # Admin role check
    └── users/
```

**Base auth layout:**

```tsx
// app/(app)/layout.tsx
import { redirect } from "next/navigation"
import { auth } from "@/lib/server/auth"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/auth/signin")
  }

  return <>{children}</>
}
```

**Role-specific nested layout:**

```tsx
// app/(admin)/layout.tsx
import { redirect } from "next/navigation"
import { auth } from "@/lib/server/auth"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/auth/signin")
  }

  // Check role from user metadata or database
  if (session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return <>{children}</>
}
```

### API Route Security

**⚠️ CRITICAL: Validate auth in EVERY API route independently. Never rely on middleware.**

```tsx
// app/api/admin/users/route.ts
import { headers } from "next/headers"
import { auth } from "@/lib/server/auth"
import { NextResponse } from "next/server"

export async function GET() {
  // Always validate auth in API routes
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    )
  }

  // Proceed with authenticated logic
  const data = await db.query.users.findMany()
  return NextResponse.json({ data })
}
```

### When to Use Middleware

**Use middleware ONLY for these specific cases:**

✅ **Do use middleware for:**
- Session cookie refresh/synchronization
- Top-level redirects (e.g., `/` → `/dashboard` for authenticated users)
- i18n routing and locale detection
- Bot protection and rate limiting
- CORS headers and global security headers

❌ **Do NOT use middleware for:**
- Route protection (use server layouts)
- Role-based access control (use nested layouts)
- Authentication gates (use server layouts)
- Any logic that needs to render UI

**Minimal middleware example:**

```tsx
// middleware.ts
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // BetterAuth handles session management automatically through API routes
  // Keep middleware minimal - no session queries needed
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
```

**Note:** With BetterAuth, you typically don't need to call `auth.api.getSession()` in middleware. Session management is handled automatically through BetterAuth's API routes. See the [BetterAuth + Drizzle section](#betterauth--drizzle-critical-configuration) below for details.

### Server-First with Client Interactivity

Fetch auth data on server, pass to client components for UI state:

```tsx
// app/dashboard/page.tsx (Server Component)
import { headers } from "next/headers"
import { auth } from "@/lib/server/auth"
import { DashboardClient } from "./dashboard-client"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  // Server-side auth and data fetching
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Fetch data with auth context
  const data = await db.query.posts.findMany({
    where: eq(posts.userId, session.user.id),
  })

  // Pass to client component for interactivity
  return <DashboardClient user={session.user} posts={data} />
}
```

```tsx
// app/dashboard/dashboard-client.tsx (Client Component)
"use client"

import { useState } from "react"
import type { User, Post } from "@/lib/server/db/schema"

interface Props {
  user: User
  posts: Post[]
}

export function DashboardClient({ user, posts }: Props) {
  const [filter, setFilter] = useState("")

  // Client-side interactivity with server data
  const filtered = posts.filter(post =>
    post.title.includes(filter)
  )

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filtered.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  )
}
```

### Client-Side Auth Hooks

For client component UI state only (not for auth gates):

```tsx
"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  const { data: session } = useSession()

  if (!session) {
    return <a href="/auth/signin">Sign In</a>
  }

  return (
    <div>
      <span>{session.user.name}</span>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  )
}
```

### BetterAuth + Drizzle: Critical Configuration

**⚠️ CRITICAL: Schema Mapping for Drizzle Adapter**

When using BetterAuth with Drizzle ORM, you MUST explicitly map your schema if you use plural table variable names.

#### The Problem

BetterAuth expects singular model names (`user`, `session`, `account`, `verification`), but it's common to export Drizzle table definitions with plural names (`users`, `sessions`, `accounts`, `verifications`).

**This will cause initialization errors:**
```typescript
// ❌ WRONG - This will fail with "Failed to initialize database adapter"
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
})
```

#### The Solution

**Option 1: Explicit Schema Mapping (Recommended)**

Map your plural variable names to BetterAuth's expected singular names:

```typescript
// ✅ CORRECT - Explicit mapping
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import { users, sessions, accounts, verifications } from "./db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,              // Map 'user' → 'users'
      session: sessions,        // Map 'session' → 'sessions'
      account: accounts,        // Map 'account' → 'accounts'
      verification: verifications, // Map 'verification' → 'verifications'
    },
  }),
  // ... rest of config
})
```

**Option 2: Use `usePlural` Flag**

If ALL your tables use plural naming:

```typescript
// ✅ ALTERNATIVE - usePlural flag
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true, // BetterAuth will look for plural names
  }),
})
```

#### Database Connection Settings

**Local Postgres.app:**
```typescript
// lib/server/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { users, sessions, accounts, verifications } from "./schema"

const connectionString = process.env.DATABASE_URL!

// ✅ Standard connection for local Postgres
export const client = postgres(connectionString)
export const db = drizzle(client, {
  schema: {
    users,
    sessions,
    accounts,
    verifications,
  },
})
```

**Supabase (Transaction Mode):**
```typescript
// Only add { prepare: false } for Supabase
export const client = postgres(connectionString, { prepare: false })
```

#### Middleware: Keep It Minimal

**⚠️ DO NOT call `auth.api.getSession()` in middleware** - this can cause database query errors.

```typescript
// ✅ CORRECT - Minimal middleware
// middleware.ts
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // BetterAuth handles session management automatically
  // No need to manually refresh sessions
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
```

**Why?** BetterAuth's API routes (`/api/auth/*`) handle session management automatically. Calling `getSession()` in middleware that runs on every request can cause:
- Database connection pool exhaustion
- Query timing errors
- Adapter initialization failures

#### Schema Table Names vs Variable Names

Your Drizzle schema definition uses **singular table names** in the database:

```typescript
// lib/server/db/schema/users.ts
export const users = pgTable("user", {      // ← Table name is "user" (singular)
  id: text("id").primaryKey(),
  // ...
})

export const sessions = pgTable("session", { // ← Table name is "session" (singular)
  id: text("id").primaryKey(),
  // ...
})
```

The **variable names** are plural (`users`, `sessions`), but the actual **database tables** are singular (`user`, `session`). BetterAuth needs to know this mapping.

#### Troubleshooting Checklist

If you see "Failed to initialize database adapter":

1. ✅ Check that table names match BetterAuth expectations (singular)
2. ✅ Verify schema mapping in `drizzleAdapter()` config
3. ✅ Ensure `DATABASE_URL` is correct and accessible
4. ✅ Run `npm run db:push` to ensure tables exist
5. ✅ Check that middleware isn't calling `getSession()` on every request
6. ✅ Verify Drizzle schema exports all required tables (user, session, account, verification)

#### Quick Reference

```typescript
// Correct BetterAuth + Drizzle Setup
// lib/server/auth.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import { users, sessions, accounts, verifications } from "./db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
})
```

### Email Service Integration

For production, replace `console.log` email handlers with a real email service.

#### Option 1: Resend (Recommended)

```bash
npm install resend
```

```typescript
// lib/server/auth.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  // ... database config
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'noreply@yourapp.com',
        to: user.email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${url}">here</a> to reset your password</p>`,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: 'noreply@yourapp.com',
        to: user.email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${url}">here</a> to verify your email</p>`,
      })
    },
  },
})
```

**Environment variables:**
```bash
RESEND_API_KEY="re_..."
```

#### Option 2: SendGrid

```bash
npm install @sendgrid/mail
```

```typescript
// lib/server/auth.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const auth = betterAuth({
  // ... database config
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sgMail.send({
        from: 'noreply@yourapp.com',
        to: user.email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${url}">here</a> to reset your password</p>`,
      })
    },
  },
})
```

**Environment variables:**
```bash
SENDGRID_API_KEY="SG...."
```

### Testing Authentication

#### Manual Testing Checklist

- [ ] Sign up with new email
- [ ] Check console for verification link (development mode)
- [ ] Click verification link
- [ ] Sign in with verified account
- [ ] Access protected dashboard
- [ ] Sign out
- [ ] Try "Forgot password" flow
- [ ] Check console for reset link (development mode)
- [ ] Reset password
- [ ] Sign in with new password
- [ ] Verify session persists on page refresh

#### Development Mode

In development, verification/reset links are logged to console:

```
Verify email for user@example.com: http://localhost:3000/auth/verify-email?token=xxx
Password reset for user@example.com: http://localhost:3000/auth/reset-password?token=xxx
```

Copy these URLs and open in browser to test the flows.

### Production Deployment Checklist

Before deploying authentication to production:

1. **Set up production database**
   - Create Supabase project (see README.md for migration guide)
   - Update `DATABASE_URL` in production environment variables

2. **Run migrations**
   ```bash
   npm run db:push
   ```

3. **Configure email service**
   - Set up Resend/SendGrid account
   - Add API key to production environment variables
   - Update `auth.ts` email handlers (remove `console.log`)
   - Enable `requireEmailVerification: true`

4. **Update environment variables**
   ```bash
   DATABASE_URL="<production-db-url>"
   BETTER_AUTH_SECRET="<new-secret-for-prod>"  # Generate new secret!
   BETTER_AUTH_URL="https://yourapp.com"
   NEXT_PUBLIC_APP_URL="https://yourapp.com"
   RESEND_API_KEY="re_..."  # or SENDGRID_API_KEY
   ```

5. **Test complete auth flows** in production before going live
   - Sign up → Email verification → Sign in
   - Password reset flow
   - Session persistence
   - Protected routes

6. **Security checklist**
   - [ ] Different `BETTER_AUTH_SECRET` for production
   - [ ] Email verification enabled
   - [ ] HTTPS enforced
   - [ ] Environment variables secured (never committed)
   - [ ] Rate limiting configured (if applicable)

## API & Server Actions

### When to Use Each

- **Server Actions**: Internal mutations, form handling, data operations
- **Route Handlers**: External APIs, webhooks, public endpoints

### Server Actions Pattern

```typescript
// lib/actions/users.ts
"use server"

import { db } from "@/lib/server/db"
import { users } from "@/lib/server/db/schema"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Define input schema
const updateUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
})

export async function updateUser(data: z.infer<typeof updateUserSchema>) {
  try {
    // 1. Validate input
    const validated = updateUserSchema.parse(data)

    // 2. Check permissions (if needed)
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session || session.user.id !== validated.id) {
      throw new Error("Unauthorized")
    }

    // 3. Perform mutation
    const [updated] = await db
      .update(users)
      .set({
        name: validated.name,
        email: validated.email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, validated.id))
      .returning()

    // 4. Revalidate affected paths
    revalidatePath(`/users/${validated.id}`)
    revalidatePath("/users")

    // 5. Return success
    return { success: true, user: updated }
  } catch (error) {
    // 6. Handle errors
    console.error("Failed to update user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}
```

### Route Handler Pattern

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const webhookSchema = z.object({
  type: z.string(),
  data: z.object({
    // Define expected data
  }),
})

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook signature
    const signature = request.headers.get("stripe-signature")
    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      )
    }

    // 2. Parse and validate body
    const body = await request.json()
    const event = webhookSchema.parse(body)

    // 3. Handle event
    switch (event.type) {
      case "payment.succeeded":
        // Handle payment
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // 4. Return success
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
```

### Edge Runtime API

```typescript
// app/api/edge/route.ts
export const runtime = "edge"

export async function GET(request: Request) {
  return new Response("Hello from the edge!", {
    status: 200,
    headers: {
      "content-type": "text/plain",
    },
  })
}
```

## Database

### Query Patterns

```typescript
// Simple select
const users = await db.query.users.findMany()

// With where clause
import { eq, and, or, gt, lt } from "drizzle-orm"

const activeUsers = await db.query.users.findMany({
  where: eq(users.active, true),
})

// Complex query
const posts = await db.query.posts.findMany({
  where: and(
    eq(posts.published, true),
    gt(posts.createdAt, new Date("2024-01-01"))
  ),
  orderBy: desc(posts.createdAt),
  limit: 10,
  offset: 0,
})

// With relations
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: true,
  },
})
```

### Transactions

```typescript
import { db } from "@/lib/server/db"

await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values({
    name: "John Doe",
    email: "john@example.com",
  }).returning()

  await tx.insert(posts).values({
    userId: user.id,
    title: "First post",
    content: "Hello world",
  })
})
```

### Migrations

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema directly (development)
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## Styling

### Tailwind Patterns

```tsx
// ✅ Use Tailwind utilities
<div className="flex items-center gap-4 rounded-lg border bg-card p-6">
  <h2 className="text-2xl font-bold">Title</h2>
</div>

// ✅ Use cn() for conditional classes
import { cn } from "@/lib/utils"

<div className={cn(
  "rounded-lg border p-4",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />

// ❌ Avoid inline styles
<div style={{ color: "red" }}>Text</div>
```

### CSS Variables (Theming)

```css
/* app/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

Use in Tailwind:

```tsx
<div className="bg-background text-foreground border-border">
  <h1 className="text-primary">Hello</h1>
</div>
```

### Component Variants (CVA)

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

## Responsive Design

### Overview

This project uses a **mobile-first** responsive design approach with Tailwind CSS v4. All components and layouts should look excellent on screens from 320px (mobile) to 2560px+ (large desktops).

### Breakpoints

Tailwind's default breakpoints (don't change these):

```typescript
{
  sm: '640px',   // Small tablets, large phones (landscape)
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops, tablets (landscape)
  xl: '1280px',  // Desktops
  '2xl': '1536px' // Large desktops
}
```

### Core Principles

1. **Mobile-First**: Write base styles for mobile, add breakpoints for larger screens
2. **Fluid Spacing**: Use responsive padding/margins that scale with screen size
3. **Responsive Typography**: Text sizes should adapt across breakpoints
4. **Touch-Friendly**: Minimum 44×44px touch targets on mobile
5. **Content-First**: Let content determine breakpoints, not devices

### Layout Components

Use these foundational components for consistent responsive layouts:

#### Container

Constrains content width with responsive padding:

```tsx
import { Container } from "@/components/shared/container"

// Standard container
<Container>
  <h1>Content</h1>
</Container>

// Full-width container
<Container size="full">
  <div>Edge-to-edge content</div>
</Container>

// Narrow container (for text content)
<Container size="narrow">
  <article>Blog post content...</article>
</Container>
```

**Responsive behavior:**
- Mobile: `px-4` (16px edges)
- Tablet: `px-6` (24px edges)
- Desktop: `px-8` (32px edges)
- Max-width: Configurable by size prop

#### PageLayout

Standardized page structure with responsive spacing:

```tsx
import { PageLayout } from "@/components/shared/page-layout"

<PageLayout
  title="Dashboard"
  description="Welcome back! Here's an overview."
>
  <div>Page content...</div>
</PageLayout>
```

**Features:**
- Responsive title sizing
- Consistent vertical spacing
- Optional description text
- Breadcrumb support (optional)

#### Section

Content sections with responsive spacing:

```tsx
import { Section } from "@/components/shared/section"

<Section>
  <h2>Section Title</h2>
  <p>Section content...</p>
</Section>

// With custom spacing
<Section spacing="lg">
  <div>More spaced content</div>
</Section>
```

### Responsive Spacing Scale

Use these standardized spacing patterns:

```tsx
// Padding (internal spacing)
className="p-4 sm:p-6 lg:p-8"           // Containers
className="p-3 sm:p-4 md:p-6"           // Cards
className="px-4 py-6 sm:px-6 sm:py-8"   // Page sections

// Gaps (between items)
className="gap-4 sm:gap-6 lg:gap-8"     // Large layouts
className="gap-2 sm:gap-3 md:gap-4"     // Component internals
className="gap-1 sm:gap-2"              // Tight spacing

// Margins (external spacing)
className="mb-6 sm:mb-8 lg:mb-12"       // Section spacing
className="mb-4 sm:mb-6"                // Content spacing
className="mb-2 sm:mb-3"                // Element spacing
```

### Responsive Typography

Use semantic sizing with breakpoint modifiers:

```tsx
// Headings
<h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
  Page Title
</h1>

<h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
  Section Title
</h2>

<h3 className="text-lg font-semibold sm:text-xl">
  Subsection Title
</h3>

// Body text
<p className="text-sm sm:text-base">
  Standard body text
</p>

<p className="text-xs sm:text-sm text-muted-foreground">
  Secondary text
</p>

// Display text (hero sections)
<h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
  Hero Title
</h1>
```

### Fluid Typography (Advanced)

For content-heavy pages, use fluid typography with `clamp()`:

```css
/* In globals.css @theme section */
--font-size-fluid-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
--font-size-fluid-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
--font-size-fluid-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
--font-size-fluid-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
--font-size-fluid-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
```

### Responsive Grid Patterns

#### Stats Grid

```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <StatsCard title="Users" value="1,234" />
  <StatsCard title="Revenue" value="$89k" />
  <StatsCard title="Growth" value="12%" />
  <StatsCard title="Active" value="567" />
</div>
```

#### Content Grid

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```

#### Sidebar Layout

```tsx
<div className="grid gap-6 lg:grid-cols-[240px_1fr]">
  <aside className="hidden lg:block">Sidebar</aside>
  <main>Main content</main>
</div>
```

### Responsive Components

#### Cards

```tsx
<div className="rounded-lg border bg-card p-4 sm:p-6">
  <h3 className="mb-3 text-base font-semibold sm:text-lg">Title</h3>
  <p className="text-sm text-muted-foreground sm:text-base">Content</p>
</div>
```

#### Buttons

```tsx
// Touch-friendly sizing
<Button size="default" className="h-11 px-6 text-base sm:h-10 sm:px-4 sm:text-sm">
  Submit
</Button>

// Icon buttons (44×44 minimum on mobile)
<Button size="icon" className="h-11 w-11 sm:h-10 sm:w-10">
  <Icon />
</Button>
```

#### Forms

```tsx
// Responsive form layouts
<form className="space-y-4 sm:space-y-6">
  <div className="grid gap-4 sm:grid-cols-2">
    <Input label="First Name" />
    <Input label="Last Name" />
  </div>
  <Input label="Email" />
  <Button className="w-full sm:w-auto">Submit</Button>
</form>
```

### Show/Hide Patterns

#### Hide on Mobile

```tsx
<div className="hidden sm:block">
  Desktop only content
</div>
```

#### Show on Mobile Only

```tsx
<div className="sm:hidden">
  Mobile only content
</div>
```

#### Responsive Navigation

```tsx
{/* Mobile menu button */}
<button className="lg:hidden">
  <Menu />
</button>

{/* Desktop navigation */}
<nav className="hidden lg:flex gap-6">
  <Link href="/about">About</Link>
  <Link href="/contact">Contact</Link>
</nav>
```

### Touch Targets

Ensure interactive elements are touch-friendly on mobile:

```tsx
// ❌ Too small for mobile
<button className="h-8 w-8 p-1">
  <Icon />
</button>

// ✅ Touch-friendly minimum
<button className="h-11 w-11 p-2 sm:h-9 sm:w-9">
  <Icon />
</button>

// ✅ With spacing
<button className="min-h-[44px] px-4 py-2 sm:min-h-[36px]">
  Click me
</button>
```

### Responsive Images

```tsx
import Image from "next/image"

// Responsive image sizing
<div className="relative aspect-video w-full">
  <Image
    src="/image.jpg"
    alt="Description"
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>

// Different images for mobile/desktop
<picture>
  <source media="(min-width: 768px)" srcSet="/desktop.jpg" />
  <img src="/mobile.jpg" alt="Description" />
</picture>
```

### Testing Responsive Design

1. **Browser DevTools**: Use responsive design mode
2. **Test on real devices**: iOS and Android
3. **Check breakpoints**: Test at 320px, 768px, 1024px, 1440px
4. **Verify touch targets**: Minimum 44×44px
5. **Test text readability**: Line length, contrast, size
6. **Horizontal scroll**: Ensure no horizontal overflow

### Common Patterns

#### Two-Column Layout

```tsx
<div className="grid gap-6 lg:grid-cols-2">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

#### Three-Column to Single

```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

#### Responsive Flexbox

```tsx
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <h2>Title</h2>
  <Button>Action</Button>
</div>
```

#### Stack on Mobile, Side-by-side on Desktop

```tsx
<div className="space-y-4 lg:flex lg:gap-6 lg:space-y-0">
  <div className="lg:flex-1">Content 1</div>
  <div className="lg:flex-1">Content 2</div>
</div>
```

### Accessibility Considerations

- Use semantic HTML (`<nav>`, `<main>`, `<article>`)
- Ensure focus states are visible
- Test with keyboard navigation
- Use ARIA labels for icon-only buttons
- Maintain color contrast ratios (WCAG AA minimum)
- Don't rely solely on color to convey information

### Performance Optimization

1. **Lazy load images**: Use Next.js `<Image>` component
2. **Minimize layout shift**: Use aspect-ratio utilities
3. **Optimize fonts**: Use `font-display: swap`
4. **Reduce JS for mobile**: Minimize client components
5. **Use content visibility**: `content-visibility: auto` for long lists

## TypeScript

### Type Inference from Database

```typescript
import type { Post } from "@/lib/server/db/schema"

// ✅ Infer from schema
function formatPost(post: Post) {
  return post.title.toUpperCase()
}

// ✅ Use Drizzle's inference
import { posts } from "@/lib/server/db/schema"

type Post = typeof posts.$inferSelect
type NewPost = typeof posts.$inferInsert
```

### Component Props

```tsx
// ✅ Explicit interface
interface UserCardProps {
  user: {
    id: string
    name: string
    email: string
  }
  onEdit?: (userId: string) => void
  className?: string
}

export function UserCard({ user, onEdit, className }: UserCardProps) {
  // ...
}

// ✅ Extending HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive"
  isLoading?: boolean
}
```

### Server Action Types

```typescript
// Define return types for server actions
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function createPost(
  data: NewPost
): Promise<ActionResult<Post>> {
  try {
    const [post] = await db.insert(posts).values(data).returning()
    return { success: true, data: post }
  } catch (error) {
    return { success: false, error: "Failed to create post" }
  }
}
```

## Testing

### Unit Tests (Vitest)

```typescript
// components/ui/button.test.tsx
import { render, screen } from "@testing-library/react"
import { Button } from "./button"

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-destructive")
  })
})
```

### Integration Tests (Server Actions)

```typescript
// lib/actions/posts.test.ts
import { createPost } from "./posts"
import { db } from "@/lib/server/db"

describe("createPost", () => {
  it("creates a post successfully", async () => {
    const result = await createPost({
      title: "Test Post",
      content: "Test content",
      slug: "test-post",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.post.title).toBe("Test Post")
    }
  })
})
```

## Common Patterns

### Loading States

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="h-4 w-96 animate-pulse rounded bg-muted" />
    </div>
  )
}
```

### Error Handling

```tsx
// app/blog/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Not Found

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation"

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, params.slug),
  })

  if (!post) {
    notFound() // Renders app/not-found.tsx
  }

  return <article>{post.content}</article>
}
```

### Form Handling

```tsx
"use client"

import { useFormStatus } from "react-dom"
import { createPost } from "@/lib/actions/posts"

export function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Post"}
    </button>
  )
}
```

## Performance Checklist

When adding features, ensure:

- [ ] Server Components by default
- [ ] Client Components only when needed
- [ ] Data fetching in Server Components
- [ ] Proper loading states (loading.tsx)
- [ ] Error boundaries (error.tsx)
- [ ] Metadata for SEO (generateMetadata)
- [ ] Type safety (TypeScript + Zod)
- [ ] Proper caching strategy
- [ ] Revalidation after mutations
- [ ] Responsive design (mobile-first)
- [ ] Accessibility (ARIA, semantic HTML)

## Quick Reference

### File Naming Conventions

- `page.tsx` - Route page
- `layout.tsx` - Route layout
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page
- `route.ts` - API route handler
- `[param]/` - Dynamic route
- `(group)/` - Route group (no URL segment)

### Import Aliases

```typescript
import { db } from "@/lib/server/db"           // Database
import { auth } from "@/lib/server/auth"       // Auth
import { Button } from "@/components/ui/button" // Components
import { cn } from "@/lib/utils"               // Utilities
```

### Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Lint code
npm run type-check   # Check types
npm run db:push      # Push schema to DB
npm run db:studio    # Open Drizzle Studio
```

---

**Remember**: This codebase prioritizes type safety, performance, and developer experience. When in doubt, prefer Server Components, explicit types, and simple patterns.
