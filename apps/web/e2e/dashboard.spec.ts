import {test, expect} from "@playwright/test"

/**
 * E2E Tests for Dashboard and Protected Features
 *
 * Tests cover:
 * - Dashboard page rendering
 * - Navigation
 * - User data display
 * - Interactive features
 */

test.describe("Dashboard", () => {
  // Helper to sign in before each test
  test.beforeEach(async ({page}) => {
    // Sign in
    await page.goto("/auth/signin")
    await page.getByLabel(/email/i).fill("test@example.com")
    await page.getByLabel(/password/i).fill("Test123!")
    await page.getByRole("button", {name: /sign in/i}).click()

    // Wait for dashboard to load
    await page.waitForURL("/dashboard", {timeout: 10000})
  })

  test.describe("Page Rendering", () => {
    test("should display dashboard page", async ({page}) => {
      // Check for dashboard content
      await expect(page.getByText(/dashboard|welcome/i)).toBeVisible()
    })

    test("should display user information", async ({page}) => {
      // Check for user name or email
      await expect(page.locator("text=/test@example.com/i")).toBeVisible({
        timeout: 5000,
      })
    })

    test("should display navigation", async ({page}) => {
      // Check for navigation elements
      const nav = page.locator("nav")
      await expect(nav).toBeVisible()
    })
  })

  test.describe("Navigation", () => {
    test("should navigate to settings (if exists)", async ({page}) => {
      // Look for settings link
      const settingsLink = page.getByRole("link", {name: /settings/i})
      if (await settingsLink.isVisible()) {
        await settingsLink.click()
        await expect(page).toHaveURL(/\/settings/, {timeout: 5000})
      }
    })

    test("should navigate back to dashboard from other pages", async ({
      page,
    }) => {
      const dashboardLink = page.getByRole("link", {name: /dashboard/i}).first()
      if (await dashboardLink.isVisible()) {
        // Navigate away
        await page.goto("/")
        // Navigate back to dashboard
        await page.goto("/dashboard")
        await expect(page).toHaveURL("/dashboard")
      }
    })
  })

  test.describe("Responsive Design", () => {
    test("should be responsive on mobile", async ({page}) => {
      // Set viewport to mobile size
      await page.setViewportSize({width: 375, height: 667})

      // Dashboard should still be accessible
      await expect(page.getByText(/dashboard|welcome/i)).toBeVisible()
    })

    test("should be responsive on tablet", async ({page}) => {
      // Set viewport to tablet size
      await page.setViewportSize({width: 768, height: 1024})

      // Dashboard should still be accessible
      await expect(page.getByText(/dashboard|welcome/i)).toBeVisible()
    })

    test("should be responsive on desktop", async ({page}) => {
      // Set viewport to desktop size
      await page.setViewportSize({width: 1920, height: 1080})

      // Dashboard should still be accessible
      await expect(page.getByText(/dashboard|welcome/i)).toBeVisible()
    })
  })

  test.describe("Theme Toggle", () => {
    test("should toggle between light and dark mode", async ({page}) => {
      // Look for theme toggle button
      const themeToggle = page.getByRole("button", {name: /theme|dark|light/i})

      if (await themeToggle.isVisible()) {
        // Get initial theme
        const html = page.locator("html")
        const initialClass = await html.getAttribute("class")

        // Click toggle
        await themeToggle.click()

        // Wait for class change
        await page.waitForTimeout(300)

        // Check that theme changed
        const newClass = await html.getAttribute("class")
        expect(newClass).not.toBe(initialClass)
      }
    })
  })

  test.describe("Error Handling", () => {
    test("should handle network errors gracefully", async ({page}) => {
      // Simulate offline mode
      await page.context().setOffline(true)

      // Try to navigate
      await page.goto("/dashboard").catch(() => {
        // Expected to fail
      })

      // Go back online
      await page.context().setOffline(false)

      // Should be able to load again
      await page.goto("/dashboard")
      await expect(page.getByText(/dashboard|welcome/i)).toBeVisible()
    })
  })

  test.describe("Performance", () => {
    test("should load dashboard within acceptable time", async ({page}) => {
      const startTime = Date.now()
      await page.goto("/dashboard")
      const loadTime = Date.now() - startTime

      // Dashboard should load within 3 seconds
      expect(loadTime).toBeLessThan(3000)
    })

    test("should have no console errors on load", async ({page}) => {
      const consoleErrors: string[] = []

      page.on("console", msg => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text())
        }
      })

      await page.goto("/dashboard")
      await page.waitForLoadState("networkidle")

      // Should have no console errors
      expect(consoleErrors).toHaveLength(0)
    })
  })
})
