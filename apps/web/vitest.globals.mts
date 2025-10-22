/**
 * Global polyfills for vitest test environment
 *
 * This file runs BEFORE any tests or modules are loaded,
 * ensuring polyfills are available for all dependencies.
 */

export function setup() {
  // Polyfill ArrayBuffer.prototype.resizable for Node.js 18
  if (!Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "resizable")) {
    Object.defineProperty(ArrayBuffer.prototype, "resizable", {
      get() {
        return false
      },
      configurable: true,
    })
  }

  // Polyfill SharedArrayBuffer.prototype.growable for Node.js 18
  if (
    typeof SharedArrayBuffer !== "undefined" &&
    !Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "growable")
  ) {
    Object.defineProperty(SharedArrayBuffer.prototype, "growable", {
      get() {
        return false
      },
      configurable: true,
    })
  }

  // Ensure global collections are available
  if (typeof global !== "undefined") {
    // @ts-expect-error - Polyfilling global for Node.js test environment
    global.WeakMap = WeakMap
    // @ts-expect-error - Polyfilling global for Node.js test environment
    global.Map = Map
    // @ts-expect-error - Polyfilling global for Node.js test environment
    global.Set = Set
  }
}
