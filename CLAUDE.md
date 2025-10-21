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

### Protecting Routes

Use server layouts for authentication:

```tsx
// app/dashboard/layout.tsx
import { redirect } from "next/navigation"
import { auth } from "@/lib/server/auth"
import { headers } from "next/headers"

export default async function DashboardLayout({
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

  return (
    <div>
      <DashboardNav user={session.user} />
      {children}
    </div>
  )
}
```

### Role-Based Access

```tsx
// app/admin/layout.tsx
import { redirect } from "next/navigation"
import { auth } from "@/lib/server/auth"
import { headers } from "next/headers"

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

  // Check role from user metadata
  if (session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return <>{children}</>
}
```

### Client-Side Auth Hooks

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
