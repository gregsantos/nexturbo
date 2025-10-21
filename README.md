# Next.js 15 Starter

A modern, production-ready Next.js 15 starter template with TypeScript, Tailwind CSS, shadcn/ui, BetterAuth, Drizzle ORM, and Turborepo.

## Features

- **Next.js 15** - Latest version with App Router and React Server Components
- **TypeScript** - Strict mode enabled for maximum type safety
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **BetterAuth** - Secure authentication with email/password
- **Drizzle ORM** - Type-safe SQL ORM with PostgreSQL
- **Turborepo** - High-performance monorepo build system
- **lucide-react** - Beautiful icon library
- **Zod** - TypeScript-first schema validation

## Project Structure

```
.
├── apps/
│   └── web/                 # Main Next.js application
│       ├── app/            # App router pages and layouts
│       ├── components/     # React components
│       ├── lib/            # Utilities and configurations
│       └── public/         # Static assets
├── packages/               # Shared packages (future use)
└── turbo.json             # Turborepo configuration
```

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
```env
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

### App Level (apps/web)

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Authentication

This starter includes BetterAuth with email/password authentication:

- **Sign Up**: `/auth/signup`
- **Sign In**: `/auth/signin`
- **Dashboard**: `/dashboard` (protected route)

### Adding Authentication to Pages

Protected routes use server-side session validation:

```typescript
import { redirect } from "next/navigation"
import { auth } from "@/lib/server/auth"
import { headers } from "next/headers"

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/auth/signin")
  }

  return <div>Protected content</div>
}
```

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

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

Build the production bundle:

```bash
npm run build
npm run start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [BetterAuth Documentation](https://www.better-auth.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Turborepo Documentation](https://turbo.build/)

## License

MIT
