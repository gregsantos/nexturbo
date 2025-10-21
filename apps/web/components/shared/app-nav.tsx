"use client"

import Link from "next/link"
import {useRouter} from "next/navigation"
import {signOut} from "@/lib/auth-client"
import {Button} from "@/components/ui/button"
import {Home, LogOut, User} from "lucide-react"

interface AppNavProps {
  user: {
    name: string
    email: string
  }
  title?: string
  homeHref?: string
}

export function AppNav({
  user,
  title = "Next.js Starter",
  homeHref = "/",
}: AppNavProps) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
        {/* Logo and Brand */}
        <Link
          href={homeHref}
          className='flex items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3'
        >
          <Home className='h-5 w-5 shrink-0 sm:h-6 sm:w-6' />
          <span className='text-base font-bold sm:text-lg'>{title}</span>
        </Link>

        {/* User Section */}
        <div className='flex items-center gap-2 sm:gap-3'>
          {/* User Info - Desktop */}
          <div className='hidden items-center gap-2 rounded-md border border-border/40 bg-muted/50 px-3 py-1.5 sm:flex'>
            <User className='h-4 w-4 shrink-0 text-muted-foreground' />
            <div className='flex flex-col'>
              <span className='text-sm font-medium leading-none'>
                {user.name}
              </span>
              <span className='text-xs text-muted-foreground'>
                {user.email}
              </span>
            </div>
          </div>

          {/* User Info - Mobile */}
          <div className='flex items-center gap-2 sm:hidden'>
            <User className='h-4 w-4 shrink-0 text-muted-foreground' />
            <span className='truncate text-sm font-medium'>{user.name}</span>
          </div>

          {/* Sign Out Button */}
          <Button
            variant='ghost'
            size='sm'
            onClick={handleSignOut}
            className='gap-2 shrink-0'
          >
            <LogOut className='h-4 w-4' />
            <span className='hidden sm:inline'>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
