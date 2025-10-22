import {z} from "zod"

/**
 * Feature Flags System
 *
 * Centralized feature flag management for controlling feature rollouts,
 * A/B testing, and environment-specific features.
 *
 * Usage:
 * - Server Components: `await getFeature("featureName")`
 * - Client Components: `useFeature("featureName")`
 * - Server Actions: `await getFeature("featureName")`
 */

// Define all feature flags with their default values
const featureFlagsSchema = z.object({
  // Authentication features
  socialAuth: z.boolean().default(false),
  emailVerificationRequired: z.boolean().default(true),
  twoFactorAuth: z.boolean().default(false),

  // Dashboard features
  dashboardAnalytics: z.boolean().default(true),
  dashboardCharts: z.boolean().default(true),
  dashboardNotifications: z.boolean().default(false),

  // User features
  userProfileEditing: z.boolean().default(true),
  userAvatarUpload: z.boolean().default(false),
  userDarkMode: z.boolean().default(true),

  // Experimental features
  experimentalFeatureA: z.boolean().default(false),
  experimentalFeatureB: z.boolean().default(false),

  // Performance features
  enableCaching: z.boolean().default(true),
  enableAnalytics: z.boolean().default(true),

  // Maintenance
  maintenanceMode: z.boolean().default(false),
  readOnlyMode: z.boolean().default(false),
})

export type FeatureFlags = z.infer<typeof featureFlagsSchema>
export type FeatureFlag = keyof FeatureFlags

/**
 * Environment-based feature flag overrides
 * Set these in .env files to override defaults
 */
const envOverrides: Partial<FeatureFlags> = {
  // Parse from environment variables
  socialAuth: process.env.NEXT_PUBLIC_FEATURE_SOCIAL_AUTH === "true",
  twoFactorAuth: process.env.NEXT_PUBLIC_FEATURE_2FA === "true",
  maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "false", // true by default
}

/**
 * Get all feature flags with environment overrides applied
 */
function getAllFeatureFlags(): FeatureFlags {
  const defaults = featureFlagsSchema.parse({})
  return {...defaults, ...envOverrides}
}

/**
 * Server-side: Get a specific feature flag value
 */
export function getFeature(flag: FeatureFlag): boolean {
  const flags = getAllFeatureFlags()
  return flags[flag]
}

/**
 * Server-side: Get all feature flags
 */
export function getAllFeatures(): FeatureFlags {
  return getAllFeatureFlags()
}

/**
 * Server-side: Check if multiple features are enabled
 */
export function getFeaturesEnabled(
  ...flags: FeatureFlag[]
): Record<FeatureFlag, boolean> {
  const allFlags = getAllFeatureFlags()
  return flags.reduce(
    (acc, flag) => {
      acc[flag] = allFlags[flag]
      return acc
    },
    {} as Record<FeatureFlag, boolean>
  )
}

/**
 * Server-side: Feature gate - throws error if feature is disabled
 */
export function requireFeature(flag: FeatureFlag, errorMessage?: string): void {
  if (!getFeature(flag)) {
    throw new Error(
      errorMessage || `Feature "${flag}" is not enabled in this environment`
    )
  }
}

/**
 * Type guard for feature flag checks in code
 */
export function isFeatureEnabled<T>(
  flag: FeatureFlag,
  enabledValue: T,
  disabledValue: T
): T {
  return getFeature(flag) ? enabledValue : disabledValue
}
