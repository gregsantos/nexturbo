import { NextRequest, NextResponse } from "next/server"

/**
 * Minimal middleware for BetterAuth session management
 *
 * BetterAuth handles session refresh automatically through its API routes.
 * This middleware is intentionally minimal.
 *
 * DO NOT use middleware for:
 * - Route protection (use server layouts in app/[route]/layout.tsx)
 * - Role-based access control (use nested layouts)
 * - Auth gates (use server layouts with `dynamic = "force-dynamic"`)
 */
export async function middleware(request: NextRequest) {
  // BetterAuth handles session management automatically
  // We don't need to manually refresh sessions here
  return NextResponse.next()
}

export const config = {
  // Run middleware on all routes except:
  // - Static files (_next/static)
  // - Images (_next/image)
  // - Favicon
  // - Public folder
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
