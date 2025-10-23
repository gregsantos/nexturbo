# Testing Guide

This guide covers the comprehensive testing strategy for this Next.js 15 application, including unit tests, integration tests, and end-to-end tests.

## Table of Contents

- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [API Mocking](#api-mocking)
- [Test Coverage](#test-coverage)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Testing Stack

- **Vitest** - Fast unit test runner with TypeScript support
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing framework
- **MSW (Mock Service Worker)** - API mocking for tests

## Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode (interactive)
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run all tests from monorepo root
npm test                    # Runs tests in all packages
npm run test:coverage       # Coverage for all packages
npm run test:e2e           # E2E tests for all apps
```

## Unit Testing

### Component Tests

Test React components in isolation using React Testing Library.

**Example: Button Component**

```typescript
// components/ui/button.test.tsx
import {describe, it, expect} from "vitest"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {Button} from "./button"

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("handles click events", async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByText("Click me"))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })
})
```

### Utility Function Tests

Test pure functions and utilities.

**Example: Utility Function**

```typescript
// lib/utils.test.ts
import {describe, it, expect} from "vitest"
import {cn} from "./utils"

describe("cn (className utility)", () => {
  it("merges class names correctly", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2")
  })

  it("handles conditional classes", () => {
    expect(cn("base", true && "active")).toBe("base active")
    expect(cn("base", false && "hidden")).toBe("base")
  })

  it("merges Tailwind conflicting classes", () => {
    expect(cn("px-4", "px-6")).toBe("px-6")
  })
})
```

## Integration Testing

### Server Action Tests

Test server actions with database mocking.

**Example: Server Action Test**

```typescript
// lib/actions/__tests__/users.test.ts
import {describe, it, expect, vi} from "vitest"
import {createUser} from "../users"

// Mock the database
vi.mock("@/lib/server/db", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [{id: "1", name: "Test"}]),
      })),
    })),
  },
}))

describe("createUser", () => {
  it("creates a user successfully", async () => {
    const result = await createUser({
      name: "John Doe",
      email: "john@example.com",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.user.name).toBe("John Doe")
    }
  })

  it("handles validation errors", async () => {
    const result = await createUser({name: "John"}) // Missing email

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain("email")
    }
  })
})
```

## E2E Testing

> **Important for Starter Template Users**: The E2E tests in this project are comprehensive examples that demonstrate testing strategies for a full authentication and dashboard implementation. **These tests will fail until you implement the corresponding features.** They serve multiple purposes:
> - **Documentation**: Shows what features should be built
> - **TDD Roadmap**: Implement features to make tests pass
> - **Learning Resource**: Demonstrates E2E testing best practices
> - **Non-blocking in CI**: E2E tests run in CI but don't block merges

### Authentication Flow Tests

Test complete user journeys with Playwright.

**Example: Sign In Flow**

```typescript
// e2e/auth.spec.ts
import {test, expect} from "@playwright/test"

test.describe("Authentication", () => {
  test("should sign in with valid credentials", async ({page}) => {
    await page.goto("/auth/signin")

    await page.getByLabel(/email/i).fill("test@example.com")
    await page.getByLabel(/password/i).fill("Test123!")
    await page.getByRole("button", {name: /sign in/i}).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard", {timeout: 10000})
  })

  test("should show error for invalid credentials", async ({page}) => {
    await page.goto("/auth/signin")

    await page.getByLabel(/email/i).fill("wrong@example.com")
    await page.getByLabel(/password/i).fill("wrongpass")
    await page.getByRole("button", {name: /sign in/i}).click()

    // Check for error message
    await expect(page.locator("text=/invalid/i")).toBeVisible()
  })
})
```

### Visual Regression Testing

```typescript
test("should match screenshot", async ({page}) => {
  await page.goto("/dashboard")
  await expect(page).toHaveScreenshot("dashboard.png")
})
```

## API Mocking

### MSW Setup

Mock API endpoints for consistent testing.

**handlers.ts**

```typescript
// mocks/handlers.ts
import {http, HttpResponse} from "msw"

export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      {id: "1", name: "John Doe"},
      {id: "2", name: "Jane Smith"},
    ])
  }),

  http.post("/api/users", async ({request}) => {
    const body = await request.json()
    return HttpResponse.json({id: "new", ...body}, {status: 201})
  }),

  http.get("/api/users/:id", ({params}) => {
    return HttpResponse.json({
      id: params.id,
      name: "Test User",
    })
  }),
]
```

### Using MSW in Tests

```typescript
import {server} from "@/mocks/server"
import {http, HttpResponse} from "msw"

test("handles API error", async () => {
  // Override handler for this test
  server.use(
    http.get("/api/users", () => {
      return new HttpResponse(null, {status: 500})
    })
  )

  // Your test code here
})
```

## Test Coverage

### Running Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html
```

### Coverage Thresholds

Configure in `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    lines: 70,
    functions: 70,
    branches: 70,
    statements: 70,
  },
}
```

### What to Test

✅ **DO test:**

- Component rendering
- User interactions
- Form submissions
- API calls
- Business logic
- Error handling
- Edge cases
- Accessibility

❌ **DON'T test:**

- Third-party libraries
- Implementation details
- Styles (unless critical)
- Console logs

## Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
test("updates user name", async () => {
  // Arrange
  const user = {id: "1", name: "Old Name"}

  // Act
  const result = await updateUser(user.id, {name: "New Name"})

  // Assert
  expect(result.name).toBe("New Name")
})
```

### 2. Use Data-TestId Sparingly

```typescript
// ✅ Prefer accessible queries
screen.getByRole("button", {name: /submit/i})
screen.getByLabelText(/email/i)

// ❌ Avoid data-testid unless necessary
screen.getByTestId("submit-button")
```

### 3. Test User Behavior, Not Implementation

```typescript
// ✅ Good - tests what user sees
test("shows success message after form submit", async () => {
  render(<ContactForm />)
  await user.type(screen.getByLabelText(/email/i), "test@example.com")
  await user.click(screen.getByRole("button", {name: /submit/i}))
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})

// ❌ Bad - tests implementation
test("calls handleSubmit when button clicked", () => {
  const handleSubmit = vi.fn()
  render(<ContactForm onSubmit={handleSubmit} />)
  // ...
  expect(handleSubmit).toHaveBeenCalled()
})
```

### 4. Keep Tests Independent

```typescript
// ✅ Each test is independent
beforeEach(() => {
  // Reset state
  vi.clearAllMocks()
})

test("test 1", () => {
  /* ... */
})
test("test 2", () => {
  /* ... */
})
```

### 5. Use Descriptive Test Names

```typescript
// ✅ Clear and descriptive
test("should display error message when email is invalid", () => {})
test("should redirect to dashboard after successful login", () => {})

// ❌ Vague
test("works", () => {})
test("email test", () => {})
```

### 6. Test Loading and Error States

```typescript
test("shows loading state", () => {
  render(<UserProfile userId="1" isLoading />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})

test("shows error state", () => {
  render(<UserProfile error="Failed to load" />)
  expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
})
```

### 7. Mock External Dependencies

```typescript
// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/test",
}))

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000"
```

## Troubleshooting

### Common Issues

#### Tests timing out

```typescript
// Increase timeout for specific test
test(
  "slow operation",
  async () => {
    /* ... */
  },
  {timeout: 10000}
)
```

#### Next.js router errors

Make sure router is mocked in `vitest.setup.ts`:

```typescript
vi.mock("next/navigation", () => ({
  useRouter: () => ({push: vi.fn()}),
  usePathname: () => "/",
}))
```

#### Database connection errors in tests

Use mocks instead of real database:

```typescript
vi.mock("@/lib/server/db")
```

#### Playwright browser not installed

```bash
npx playwright install
```

### Debugging Tests

**Vitest UI Mode:**

```bash
npm run test:ui
```

**Playwright Debug Mode:**

```bash
npm run test:e2e:debug
```

**VS Code Debugging:**

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal"
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Test Coverage Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Remember**: Tests are code too - keep them clean, maintainable, and focused on behavior!
