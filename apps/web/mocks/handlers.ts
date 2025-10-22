import {http, HttpResponse} from "msw"

/**
 * MSW (Mock Service Worker) Handlers
 *
 * Define mock API responses for testing.
 * These handlers intercept network requests during tests.
 */

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const handlers = [
  // Example: Mock user authentication endpoint
  http.get(`${baseUrl}/api/auth/session`, () => {
    return HttpResponse.json({
      user: {
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
        image: null,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      session: {
        id: "test-session-id",
        userId: "test-user-id",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: "127.0.0.1",
        userAgent: "test-agent",
      },
    })
  }),

  // Example: Mock sign in endpoint
  http.post(`${baseUrl}/api/auth/sign-in`, async ({request}) => {
    const body = await request.json()

    // Simulate validation
    if (!body || typeof body !== "object") {
      return new HttpResponse(null, {
        status: 400,
        statusText: "Invalid request body",
      })
    }

    // Simulate successful sign in
    return HttpResponse.json({
      user: {
        id: "test-user-id",
        email: body.email,
        name: "Test User",
      },
      session: {
        id: "test-session-id",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    })
  }),

  // Example: Mock sign up endpoint
  http.post(`${baseUrl}/api/auth/sign-up`, async ({request}) => {
    const body = await request.json()

    // Simulate email already exists error
    if (body.email === "existing@example.com") {
      return new HttpResponse(null, {
        status: 409,
        statusText: "Email already exists",
      })
    }

    // Simulate successful sign up
    return HttpResponse.json(
      {
        user: {
          id: "new-user-id",
          email: body.email,
          name: body.name,
        },
      },
      {status: 201}
    )
  }),

  // Example: Mock sign out endpoint
  http.post(`${baseUrl}/api/auth/sign-out`, () => {
    return new HttpResponse(null, {status: 200})
  }),

  // Example: Mock user data endpoint
  http.get(`${baseUrl}/api/users/:id`, ({params}) => {
    const {id} = params

    if (id === "not-found") {
      return new HttpResponse(null, {status: 404})
    }

    return HttpResponse.json({
      id,
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date().toISOString(),
    })
  }),

  // Example: Mock external API (if you have any)
  http.get("https://api.example.com/data", () => {
    return HttpResponse.json({
      message: "Mocked external API response",
      data: [1, 2, 3],
    })
  }),
]

/**
 * Error handlers for testing error scenarios
 */
export const errorHandlers = [
  http.get(`${baseUrl}/api/auth/session`, () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    })
  }),
]
