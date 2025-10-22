import {redirect} from "next/navigation"
import {headers} from "next/headers"
import {auth} from "@/lib/server/auth"
import {AnimatedHero} from "@/components/landing/animated-hero"

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

  return <AnimatedHero />
}
