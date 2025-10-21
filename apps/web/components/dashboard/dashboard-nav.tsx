"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Home, LogOut, User } from "lucide-react"

interface DashboardNavProps {
  user: {
    name: string
    email: string
  }
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <span className="font-bold">Next.js Starter</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="text-sm">{user.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
