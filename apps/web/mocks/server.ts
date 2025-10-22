import {setupServer} from "msw/node"
import {handlers} from "./handlers"

/**
 * MSW Server Setup for Node.js (tests)
 *
 * This configures MSW to intercept requests in Node.js environment (Vitest).
 * Import this in your test setup file to enable mocking.
 */
export const server = setupServer(...handlers)
