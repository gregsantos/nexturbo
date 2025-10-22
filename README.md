# Next.js 15 Starter

A modern, production-ready Next.js 15 starter template with TypeScript, Tailwind CSS, shadcn/ui, BetterAuth, Drizzle ORM, and Turborepo.

## Features

### Core Stack
- **Next.js 15** - Latest version with App Router and React Server Components
- **TypeScript** - Strict mode enabled for maximum type safety
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **BetterAuth** - Secure authentication with email/password
- **Drizzle ORM** - Type-safe SQL ORM with PostgreSQL
- **Turborepo** - High-performance monorepo build system
- **lucide-react** - Beautiful icon library
- **Zod** - TypeScript-first schema validation

### Testing & Quality
- **Vitest** - Fast unit/integration testing with React support
- **Playwright** - Multi-browser E2E testing
- **MSW** - API mocking for consistent tests
- **70%+ Coverage** - Configured thresholds for all metrics

### Production Features
- **Feature Flags** - Environment-based feature toggles
- **Structured Logging** - Pino logger with sensitive data redaction
- **Security Headers** - XSS, CSP, CORS, and frame protection
- **Framer Motion** - Smooth, performant animations
- **GitHub Actions** - Automated CI/CD pipeline

### Developer Experience
- **Comprehensive Docs** - CLAUDE.md (1200+ lines) + TESTING.md
- **Claude Skills** - Guided workflows for common tasks
- **Type-Safe APIs** - End-to-end type safety
- **Hot Reload** - Instant feedback with Turbopack

## Project Structure

```md
.
claude-next/
├── .claude/
│ └── skills/ # Claude Code skills for guided workflows
│ ├── add-feature.md # Complete feature implementation
│ ├── add-db-table.md # Database table creation
│ ├── add-component.md # Component patterns
│ └── README.md # Skills documentation
├── apps/
│ └── web/ # Main Next.js application
│ ├── app/
│ │ ├── auth/ # Authentication pages
│ │ ├── dashboard/ # Protected dashboard
│ │ └── api/auth/ # BetterAuth API routes
│ ├── components/
│ │ ├── ui/ # shadcn/ui components
│ │ ├── auth/ # Auth forms
│ │ └── dashboard/ # Dashboard components
│ ├── lib/
│ │ ├── server/ # Server-only code
│ │ ├── actions/ # Server actions (future)
│ │ └── utils.ts # Utilities
│ └── public/ # Static assets
├── CLAUDE.md # Comprehensive development guide
├── README.md # Project documentation
└── turbo.json # Turborepo configuration
```

## Why Turborepo?

This starter uses Turborepo for several strategic reasons:

### Benefits

- **Consistency** - Standardized structure across all team projects
- **Scalability** - Easily add additional apps (admin panels, docs, marketing sites)
- **Code Sharing** - Extract common code to shared packages when needed
- **Build Optimization** - Intelligent caching and parallel builds
- **Team Workflow** - Remote caching for faster builds across team members
- **Future-Proof** - Enterprise-grade setup from day one

### Common Growth Patterns

As your project grows, you can easily expand:

```md
apps/
├── web/ # Main customer-facing app
├── admin/ # Internal admin dashboard
├── marketing/ # Marketing/landing pages
└── docs/ # Documentation site

packages/
├── ui/ # Shared component library
├── config/ # Shared configurations
├── database/ # Shared database schemas
└── utils/ # Shared utility functions
```

### Vercel Deployment

Turborepo has **first-class support** on Vercel (they acquired Turborepo):

1. **Auto-Detection** - Vercel automatically detects `turbo.json`
2. **Simple Setup** - Just set `apps/web` as the Root Directory
3. **Optimized Builds** - Leverages Turborepo's caching automatically
4. **Multiple Apps** - Deploy each app as a separate Vercel project from the same repo

See the [Deployment](#deployment) section for detailed instructions.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd claude-next
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cd apps/web
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key-here-generate-a-random-string"
BETTER_AUTH_URL="http://localhost:3000"
```

5. Generate and run database migrations:

```bash
cd apps/web
npm run db:push
```

6. Start the development server:

```bash
# From root directory
npm run dev

# Or from apps/web
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Root Level

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps for production
- `npm run lint` - Lint all apps
- `npm run type-check` - Type check all apps
- `npm test` - Run all unit tests
- `npm run test:ui` - Run tests in interactive UI mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run E2E tests with Playwright

### App Level (apps/web)

#### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

#### Testing
- `npm test` - Run unit tests
- `npm run test:ui` - Run tests in interactive UI mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:e2e` - Run E2E tests
- `npm run test:e2e:ui` - Run E2E tests in UI mode
- `npm run test:e2e:debug` - Debug E2E tests

#### Database
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Authentication

This starter includes BetterAuth with email/password authentication:

- **Sign Up**: `/auth/signup`
- **Sign In**: `/auth/signin`
- **Dashboard**: `/dashboard` (protected route)

### ⚠️ Authentication Best Practices

This starter follows Next.js 15 App Router best practices by using **server layouts for authentication**, not middleware.

**Why server layouts:**
- ✅ Execute on the same request (no extra hops)
- ✅ Full TypeScript support
- ✅ Can render UI and compose with data fetching
- ✅ Co-located with protected routes

### Protecting Routes with Server Layouts

**Always use `dynamic = "force-dynamic"` in auth layouts** for fresh auth checks:

```typescript
// app/dashboard/layout.tsx
import {redirect} from "next/navigation"
import {auth} from "@/lib/server/auth"
import {headers} from "next/headers"

// Force dynamic rendering for fresh auth checks
export const dynamic = "force-dynamic"

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

Use nested layouts with route groups for role-based access:

```typescript
// app/(admin)/layout.tsx
import {redirect} from "next/navigation"
import {auth} from "@/lib/server/auth"
import {headers} from "next/headers"

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

  // Check role
  if (session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return <>{children}</>
}
```

### API Route Security

⚠️ **Always validate auth in API routes independently:**

```typescript
// app/api/admin/route.ts
import {headers} from "next/headers"
import {auth} from "@/lib/server/auth"
import {NextResponse} from "next/server"

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401})
  }

  // Proceed with authenticated logic
  return NextResponse.json({data})
}
```

See [CLAUDE.md](./CLAUDE.md#authentication) for comprehensive authentication patterns.

## Database

### Schema

Database schemas are defined in `apps/web/lib/server/db/schema/`. The starter includes user, session, account, and verification tables for BetterAuth.

### Adding New Tables

1. Create a new schema file in `apps/web/lib/server/db/schema/`
2. Export it from `apps/web/lib/server/db/schema/index.ts`
3. Generate and run migrations:

```bash
npm run db:generate
npm run db:push
```

## Styling

This project uses Tailwind CSS v4 with shadcn/ui components. CSS variables are defined in `apps/web/app/globals.css` for easy theming.

### Dark Mode

Dark mode is enabled by default. The theme can be customized by modifying CSS variables in `globals.css`.

## Best Practices

This starter follows Next.js 15 best practices:

- **Server Components by Default** - Client components only when needed
- **Data Fetching** - Server-side with async/await
- **Type Safety** - Strict TypeScript and Zod validation
- **Performance** - Turbopack for fast builds and HMR
- **SEO** - Metadata API for all pages
- **Accessibility** - ARIA attributes and semantic HTML

## Testing

This starter includes comprehensive testing infrastructure for production-ready applications.

### Quick Start

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Interactive test UI
npm run test:ui
```

### What's Included

- **Vitest** - Fast unit/integration testing
- **React Testing Library** - Component testing
- **Playwright** - Multi-browser E2E testing
- **MSW** - API request mocking

### Example Tests

**Component Test:**
```typescript
import {render, screen} from "@testing-library/react"
import {Button} from "./button"

test("renders button", () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText("Click me")).toBeInTheDocument()
})
```

**E2E Test:**
```typescript
import {test, expect} from "@playwright/test"

test("sign in flow", async ({page}) => {
  await page.goto("/auth/signin")
  await page.getByLabel(/email/i).fill("test@example.com")
  await page.getByLabel(/password/i).fill("password")
  await page.getByRole("button", {name: /sign in/i}).click()
  await expect(page).toHaveURL("/dashboard")
})
```

For comprehensive testing guides, see [apps/web/docs/TESTING.md](./apps/web/docs/TESTING.md).

## Production Features

### Feature Flags

Control feature rollouts with environment-based flags:

```typescript
// Server components
import {getFeature} from "@/lib/feature-flags"

const isEnabled = getFeature("newFeature")

// Client components
import {useFeature} from "@/lib/hooks/use-feature"

const isEnabled = useFeature("newFeature")
```

Configure in `.env`:
```bash
NEXT_PUBLIC_FEATURE_SOCIAL_AUTH="true"
NEXT_PUBLIC_MAINTENANCE_MODE="false"
```

### Structured Logging

Production-ready logging with Pino:

```typescript
import {logger} from "@/lib/server/logger"

logger.info({userId: "123"}, "User logged in")
logger.error({err: error}, "Failed to process")
```

### Security

- ✅ Security headers (XSS, CSP, frame protection)
- ✅ CORS configuration
- ✅ Sensitive data redaction in logs
- ✅ Content Security Policy

### Animations

Smooth, accessible animations with Framer Motion:

```typescript
import {motion} from "framer-motion"
import {fadeInUp} from "@/lib/animations/variants"

<motion.div variants={fadeInUp} initial="hidden" animate="visible">
  Animated content
</motion.div>
```

See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for all features.

## Deployment

### Vercel (Recommended)

Vercel has native Turborepo support, making deployment seamless:

#### Initial Setup

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import in Vercel**

   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Vercel will auto-detect the monorepo structure

3. **Configure Project Settings**

   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web` ⚠️ Important!
   - **Build Command**: Leave default (Vercel auto-detects)
   - **Output Directory**: Leave default (`.next`)
   - **Install Command**: Leave default (npm install)

4. **Environment Variables**

   Add these in the Vercel dashboard:

   ```
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   BETTER_AUTH_SECRET=your-production-secret
   BETTER_AUTH_URL=https://your-domain.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build using Turborepo automatically

#### Subsequent Deployments

Every push to `main` will automatically deploy. For other branches:

- Vercel creates preview deployments automatically
- Each PR gets its own preview URL

#### Deploying Multiple Apps

When you add more apps (admin, docs, etc.):

1. Create a new Vercel project
2. Import the same GitHub repository
3. Set Root Directory to the new app (e.g., `apps/admin`)
4. Configure environment variables for that app
5. Deploy

**Result**: Multiple apps from one repo, each with independent deployments and domains.

#### Build Performance

Turborepo's caching works automatically on Vercel:

- Faster builds (only rebuilds what changed)
- Shared cache across deployments
- Parallel builds for multiple apps

### Other Platforms

For non-Vercel deployments:

```bash
# Build all apps
npm run build

# Start production server (from apps/web)
cd apps/web
npm run start
```

**Docker Deployment:**

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

WORKDIR /app/apps/web
CMD ["npm", "start"]
```

**Environment Variables:**
Ensure all environment variables are set in your hosting platform's dashboard or deployment configuration.

## Development Resources

This starter includes comprehensive documentation and tooling:

### Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive development guide

  - Architecture principles and patterns
  - Component creation (Server vs Client)
  - Data fetching strategies
  - Authentication patterns
  - Database operations with Drizzle
  - Styling guidelines
  - TypeScript best practices
  - Testing patterns
  - Quick reference

- **[apps/web/DEVELOPMENT.md](./apps/web/DEVELOPMENT.md)** - Quick reference
  - Common tasks and commands
  - Key patterns
  - File structure
  - Environment setup

### Claude Skills

Located in `.claude/skills/`, these provide guided workflows:

- **add-feature** - Complete feature implementation workflow
- **add-db-table** - Database table creation with Drizzle ORM
- **add-component** - Component creation following best practices

To use a skill with Claude Code:

```
I need to add a new feature for user profiles.
Use the add-feature skill.
```

See [.claude/skills/README.md](./.claude/skills/README.md) for details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [BetterAuth Documentation](https://www.better-auth.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Turborepo Documentation](https://turbo.build/)

## License

MIT
