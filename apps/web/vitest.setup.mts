import "@testing-library/jest-dom/vitest"
import {cleanup} from "@testing-library/react"
import {afterEach, beforeAll, afterAll, vi} from "vitest"
import {server} from "./mocks/server"

// Polyfill browser globals for CI environment (fixes webidl-conversions errors)
// This is needed because some dependencies expect browser globals in jsdom
if (typeof global !== "undefined") {
  // Ensure WeakMap is available on global
  if (!global.WeakMap) {
    global.WeakMap = WeakMap
  }
  // Ensure Map is available on global
  if (!global.Map) {
    global.Map = Map
  }
  // Ensure Set is available on global
  if (!global.Set) {
    global.Set = Set
  }
}

// Start MSW server before all tests
beforeAll(() => server.listen({onUnhandledRequest: "warn"}))

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

// Close MSW server after all tests
afterAll(() => server.close())

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  notFound: vi.fn(),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000"
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test"
process.env.BETTER_AUTH_SECRET = "test-secret-at-least-32-characters-long"
process.env.BETTER_AUTH_URL = "http://localhost:3000"
