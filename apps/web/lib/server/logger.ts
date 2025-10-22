import pino from "pino"

/**
 * Structured Logging with Pino
 *
 * Provides centralized logging for the application with:
 * - Structured JSON logs in production
 * - Pretty-printed logs in development
 * - Log levels (trace, debug, info, warn, error, fatal)
 * - Automatic error serialization
 * - Request/response logging
 */

const isDevelopment = process.env.NODE_ENV === "development"
const isProduction = process.env.NODE_ENV === "production"

// Create base logger
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),

  // Format logs differently based on environment
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      }
    : undefined,

  // Base configuration
  base: {
    env: process.env.NODE_ENV,
  },

  // Serializers for common objects
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },

  // Redact sensitive data
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "token",
      "apiKey",
      "secret",
    ],
    remove: true,
  },
})

/**
 * Create a child logger with additional context
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context)
}

/**
 * Log HTTP request
 */
export function logRequest(method: string, url: string, context?: object) {
  logger.info({method, url, ...context}, "HTTP Request")
}

/**
 * Log HTTP response
 */
export function logResponse(
  method: string,
  url: string,
  statusCode: number,
  duration: number,
  context?: object
) {
  logger.info(
    {method, url, statusCode, duration, ...context},
    "HTTP Response"
  )
}

/**
 * Log database query
 */
export function logQuery(query: string, duration?: number, context?: object) {
  logger.debug({query, duration, ...context}, "Database Query")
}

/**
 * Log authentication event
 */
export function logAuth(
  event: "signin" | "signup" | "signout" | "verify" | "reset",
  userId?: string,
  context?: object
) {
  logger.info({event, userId, ...context}, "Auth Event")
}

/**
 * Log error with full stack trace
 */
export function logError(error: Error, context?: object) {
  logger.error({err: error, ...context}, error.message)
}

/**
 * Log performance metric
 */
export function logMetric(
  metric: string,
  value: number,
  unit: string = "ms",
  context?: object
) {
  logger.info({metric, value, unit, ...context}, "Performance Metric")
}

/**
 * Log business event (for analytics)
 */
export function logEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  logger.info({event, properties}, "Business Event")
}

// Export logger as default
export default logger
