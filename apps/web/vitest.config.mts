import {defineConfig} from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

// Polyfill browser globals BEFORE any tests load (fixes webidl-conversions errors in CI)
if (typeof global !== "undefined") {
  // @ts-expect-error - Polyfilling global for Node.js test environment
  global.WeakMap = WeakMap
  // @ts-expect-error - Polyfilling global for Node.js test environment
  global.Map = Map
  // @ts-expect-error - Polyfilling global for Node.js test environment
  global.Set = Set

  // Polyfill ArrayBuffer.prototype.resizable and SharedArrayBuffer.prototype.growable
  // These are newer web platform features not available in Node.js 18
  if (!Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "resizable")) {
    Object.defineProperty(ArrayBuffer.prototype, "resizable", {
      get() { return false },
      configurable: true,
    })
  }
  if (typeof SharedArrayBuffer !== "undefined" &&
      !Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "growable")) {
    Object.defineProperty(SharedArrayBuffer.prototype, "growable", {
      get() { return false },
      configurable: true,
    })
  }
}

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.mts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        ".next/",
        "coverage/",
        "**/*.config.{ts,js}",
        "**/*.d.ts",
        "**/types/**",
        "**/__tests__/**",
        "e2e/**",
      ],
      thresholds: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
