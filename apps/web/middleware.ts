import {NextRequest, NextResponse} from "next/server"

/**
 * Middleware for security headers and session management
 *
 * BetterAuth handles session refresh automatically through its API routes.
 * This middleware is intentionally minimal for auth, but adds security headers.
 *
 * DO NOT use middleware for:
 * - Route protection (use server layouts in app/[route]/layout.tsx)
 * - Role-based access control (use nested layouts)
 * - Auth gates (use server layouts with `dynamic = "force-dynamic"`)
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security Headers
  const securityHeaders = {
    // XSS Protection
    "X-XSS-Protection": "1; mode=block",

    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",

    // Referrer Policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions Policy (formerly Feature Policy)
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",

    // Frame Options
    "X-Frame-Options": "DENY",

    // Content Security Policy
    "Content-Security-Policy":
      process.env.NODE_ENV === "production"
        ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
        : "default-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  }

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // CORS headers for API routes (customize as needed)
  if (request.nextUrl.pathname.startsWith("/api")) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ]
    const origin = request.headers.get("origin")

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      )
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      )
      response.headers.set("Access-Control-Max-Age", "86400")
    }

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {status: 200, headers: response.headers})
    }
  }

  return response
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
