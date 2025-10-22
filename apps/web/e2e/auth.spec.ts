import {test, expect} from "@playwright/test"

/**
 * E2E Tests for Authentication Flows
 *
 * Tests cover:
 * - Sign in flow
 * - Sign up flow
 * - Sign out flow
 * - Protected route access
 * - Invalid credentials handling
 */

test.describe("Authentication", () => {
  test.beforeEach(async ({page}) => {
    // Start from the home page
    await page.goto("/")
  })

  test.describe("Sign In", () => {
    test("should display sign in page", async ({page}) => {
      // Navigate to sign in page
      await page.goto("/auth/signin")

      // Check for sign in form elements
      await expect(
        page.getByRole("heading", {name: /sign in/i})
      ).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i)).toBeVisible()
      await expect(
        page.getByRole("button", {name: /sign in/i})
      ).toBeVisible()
    })

    test("should show validation errors for empty fields", async ({page}) => {
      await page.goto("/auth/signin")

      // Click sign in without filling fields
      await page.getByRole("button", {name: /sign in/i}).click()

      // Check for validation messages (adjust selectors based on your implementation)
      await expect(page.locator("text=/required/i").first()).toBeVisible()
    })

    test("should show error for invalid credentials", async ({page}) => {
      await page.goto("/auth/signin")

      // Fill in invalid credentials
      await page.getByLabel(/email/i).fill("invalid@example.com")
      await page.getByLabel(/password/i).fill("wrongpassword")
      await page.getByRole("button", {name: /sign in/i}).click()

      // Check for error message
      await expect(
        page.locator("text=/invalid (credentials|email or password)/i")
      ).toBeVisible({timeout: 5000})
    })

    test("should successfully sign in with valid credentials", async ({
      page,
    }) => {
      // Note: This test requires a test user in your database
      // You may need to seed test data or mock the API
      await page.goto("/auth/signin")

      await page.getByLabel(/email/i).fill("test@example.com")
      await page.getByLabel(/password/i).fill("Test123!")
      await page.getByRole("button", {name: /sign in/i}).click()

      // Should redirect to dashboard
      await expect(page).toHaveURL("/dashboard", {timeout: 10000})
    })
  })

  test.describe("Sign Up", () => {
    test("should display sign up page", async ({page}) => {
      await page.goto("/auth/signup")

      await expect(
        page.getByRole("heading", {name: /sign up|create account/i})
      ).toBeVisible()
      await expect(page.getByLabel(/name/i)).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i)).toBeVisible()
      await expect(
        page.getByRole("button", {name: /sign up|create account/i})
      ).toBeVisible()
    })

    test("should show validation errors for invalid data", async ({page}) => {
      await page.goto("/auth/signup")

      // Try to submit with invalid email
      await page.getByLabel(/name/i).fill("Test User")
      await page.getByLabel(/email/i).fill("invalid-email")
      await page.getByLabel(/password/i).fill("123") // Too short
      await page.getByRole("button", {name: /sign up|create account/i}).click()

      // Check for validation messages
      await expect(page.locator("text=/valid email/i")).toBeVisible()
      await expect(page.locator("text=/at least/i")).toBeVisible()
    })

    test("should successfully create new account", async ({page}) => {
      await page.goto("/auth/signup")

      const randomEmail = `test-${Date.now()}@example.com`

      await page.getByLabel(/name/i).fill("Test User")
      await page.getByLabel(/email/i).fill(randomEmail)
      await page.getByLabel(/password/i).fill("Test123!@#")
      await page.getByRole("button", {name: /sign up|create account/i}).click()

      // Should redirect to dashboard or verification page
      await expect(page).not.toHaveURL("/auth/signup", {timeout: 10000})
    })
  })

  test.describe("Sign Out", () => {
    test("should sign out successfully", async ({page}) => {
      // First sign in
      await page.goto("/auth/signin")
      await page.getByLabel(/email/i).fill("test@example.com")
      await page.getByLabel(/password/i).fill("Test123!")
      await page.getByRole("button", {name: /sign in/i}).click()

      await expect(page).toHaveURL("/dashboard", {timeout: 10000})

      // Click sign out
      await page.getByRole("button", {name: /sign out|log out/i}).click()

      // Should redirect to home or sign in page
      await expect(page).toHaveURL(/\/(|auth\/signin)/, {timeout: 5000})
    })
  })

  test.describe("Protected Routes", () => {
    test("should redirect to sign in when accessing protected route without auth", async ({
      page,
    }) => {
      await page.goto("/dashboard")

      // Should redirect to sign in
      await expect(page).toHaveURL("/auth/signin", {timeout: 5000})
    })

    test("should allow access to dashboard when authenticated", async ({
      page,
    }) => {
      // Sign in first
      await page.goto("/auth/signin")
      await page.getByLabel(/email/i).fill("test@example.com")
      await page.getByLabel(/password/i).fill("Test123!")
      await page.getByRole("button", {name: /sign in/i}).click()

      // Should be able to access dashboard
      await expect(page).toHaveURL("/dashboard", {timeout: 10000})
      await expect(page.getByText(/dashboard|welcome/i)).toBeVisible()
    })
  })

  test.describe("Password Reset", () => {
    test("should display forgot password page", async ({page}) => {
      await page.goto("/auth/forgot-password")

      await expect(
        page.getByRole("heading", {name: /forgot password|reset password/i})
      ).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(
        page.getByRole("button", {name: /send|reset/i})
      ).toBeVisible()
    })

    test("should accept email for password reset", async ({page}) => {
      await page.goto("/auth/forgot-password")

      await page.getByLabel(/email/i).fill("test@example.com")
      await page.getByRole("button", {name: /send|reset/i}).click()

      // Check for success message
      await expect(page.locator("text=/check your email/i")).toBeVisible({
        timeout: 5000,
      })
    })
  })
})
