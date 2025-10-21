---
name: Add Component
description: Add a new component following Next.js 15 and shadcn/ui best practices
---

# Add Component Skill

You are helping create a new component in a Next.js 15 application with TypeScript, Tailwind CSS, and shadcn/ui.

## Context

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **TypeScript**: Strict mode
- **Component Library**: shadcn/ui (Radix UI primitives)

## Decision: Server or Client Component?

### Ask First

Before creating any component, determine if it needs to be a Client Component.

**Use Server Component (default) if:**
- No interactivity needed
- No React hooks (useState, useEffect, etc.)
- No browser APIs
- Just rendering data

**Use Client Component only if:**
- Has onClick, onChange, or other event handlers
- Uses React hooks (useState, useEffect, useContext)
- Uses browser APIs (localStorage, window, etc.)
- Needs real-time updates

## Component Types

### 1. UI Component (shadcn/ui style)

For reusable UI primitives (buttons, inputs, cards, etc.):

```typescript
// components/ui/[component-name].tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        default: "default-size-classes",
        sm: "small-size-classes",
        lg: "large-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // Custom props here
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Component.displayName = "Component"

export { Component, componentVariants }
```

### 2. Server Component (Default)

For components that just render data:

```typescript
// components/[feature]/[component-name].tsx
interface ComponentProps {
  data: DataType
  className?: string
}

export function Component({ data, className }: ComponentProps) {
  return (
    <div className={className}>
      {/* Render data */}
    </div>
  )
}
```

### 3. Client Component

For interactive components:

```typescript
// components/[feature]/[component-name].tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ComponentProps {
  initialValue?: string
  onSubmit?: (value: string) => void
}

export function Component({ initialValue = "", onSubmit }: ComponentProps) {
  const [value, setValue] = useState(initialValue)

  function handleSubmit() {
    onSubmit?.(value)
  }

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  )
}
```

### 4. Form Component (with Server Action)

```typescript
// components/[feature]/[form-name].tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { serverAction } from "@/lib/actions/[feature]"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormComponent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await serverAction({
      field: formData.get("field") as string,
    })

    if (result.success) {
      router.push("/success")
      router.refresh()
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="field">Field Label</Label>
        <Input
          id="field"
          name="field"
          type="text"
          required
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}
```

## Styling Guidelines

### Use Tailwind Classes

```typescript
// ✅ Good - Tailwind utilities
<div className="flex items-center gap-4 rounded-lg border bg-card p-6">
  <h2 className="text-2xl font-bold">Title</h2>
</div>

// ❌ Bad - Inline styles
<div style={{ display: 'flex', padding: '24px' }}>
  <h2 style={{ fontSize: '24px' }}>Title</h2>
</div>
```

### Use cn() for Conditional Classes

```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "rounded-lg border p-4",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />
```

### Use Design System Colors

```typescript
// ✅ Good - Use CSS variables
<div className="bg-background text-foreground border-border">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>

// ❌ Bad - Hard-coded colors
<div className="bg-white text-black border-gray-200">
  <h1 className="text-blue-600">Title</h1>
</div>
```

## TypeScript Guidelines

### Define Explicit Props

```typescript
// ✅ Good - Explicit interface
interface UserCardProps {
  user: {
    id: string
    name: string
    email: string
  }
  showEmail?: boolean
  onEdit?: (userId: string) => void
  className?: string
}

// ❌ Bad - Implicit any
function UserCard(props) {
  // ...
}
```

### Extend HTML Attributes

```typescript
// For native HTML elements
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive"
  isLoading?: boolean
}

// For divs
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
}
```

### Use forwardRef for Reusable Components

```typescript
import * as React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <input ref={ref} className={className} {...props} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
```

## Composition Pattern

Pass Server Components to Client Components as children:

```typescript
// app/page.tsx (Server Component)
import { ClientWrapper } from "@/components/client-wrapper"
import { ServerData } from "@/components/server-data"

export default async function Page() {
  return (
    <ClientWrapper>
      <ServerData />  {/* Server Component as child */}
    </ClientWrapper>
  )
}

// components/client-wrapper.tsx (Client Component)
"use client"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <div className="interactive-wrapper">{children}</div>
}

// components/server-data.tsx (Server Component)
export async function ServerData() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

## Common Patterns

### Card Component

```typescript
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

export function Card({
  title,
  description,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="border-b p-6">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}
```

### Loading Skeleton

```typescript
export function ComponentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="h-4 w-96 animate-pulse rounded bg-muted" />
      <div className="h-4 w-80 animate-pulse rounded bg-muted" />
    </div>
  )
}
```

### Empty State

```typescript
import { FileX } from "lucide-react"

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FileX className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
```

## Accessibility

Always include proper accessibility attributes:

```typescript
// Labels for inputs
<Label htmlFor="email">Email</Label>
<Input id="email" name="email" type="email" />

// ARIA attributes
<button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" />
</button>

// Semantic HTML
<article>
  <h1>Title</h1>
  <p>Content</p>
</article>
```

## File Organization

```
components/
├── ui/                     # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── auth/                   # Auth-specific components
│   ├── signin-form.tsx
│   └── signup-form.tsx
├── dashboard/              # Dashboard components
│   ├── stats-card.tsx
│   └── nav.tsx
└── shared/                 # Shared across features
    ├── header.tsx
    └── footer.tsx
```

## Checklist

Before completing, ensure:

- [ ] Correct component type (Server vs Client)
- [ ] TypeScript interfaces defined
- [ ] Props properly typed
- [ ] Tailwind classes used (no inline styles)
- [ ] Responsive design (mobile-first)
- [ ] Accessibility attributes
- [ ] Error states handled
- [ ] Loading states (if async)
- [ ] Exported correctly
- [ ] Documented if complex

---

Now help the user create their component!
