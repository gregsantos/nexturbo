import Link from "next/link"
import {redirect} from "next/navigation"
import {headers} from "next/headers"
import {auth} from "@/lib/server/auth"

// Force dynamic rendering to check auth on every request
export const dynamic = "force-dynamic"

export default async function Home() {
  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Redirect authenticated users to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-8'>
      <main className='flex flex-col items-center gap-8 text-center'>
        <h1 className='text-4xl font-bold tracking-tight sm:text-6xl'>
          Next.js 15 Starter
        </h1>
        <p className='max-w-2xl text-lg text-muted-foreground'>
          A modern, production-ready starter with Next.js 15, TypeScript,
          Tailwind CSS, shadcn/ui, BetterAuth, Drizzle ORM, and Turborepo.
        </p>

        <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
          <Link
            href='/dashboard'
            className='inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          >
            View Dashboard
          </Link>
          <Link
            href='/auth/signin'
            className='inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          >
            Sign In
          </Link>
        </div>

        <div className='mt-16 grid gap-4 sm:grid-cols-3'>
          <FeatureCard
            title='Server Components'
            description='Built with React Server Components for optimal performance'
          />
          <FeatureCard
            title='Type-Safe'
            description='End-to-end type safety with TypeScript and Zod validation'
          />
          <FeatureCard
            title='Auth Ready'
            description='BetterAuth integration with email/password authentication'
          />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className='rounded-lg border bg-card p-6 text-card-foreground'>
      <h3 className='mb-2 font-semibold'>{title}</h3>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  )
}
