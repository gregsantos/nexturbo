"use client"

import {useEffect, useState} from "react"
import type {FeatureFlag, FeatureFlags} from "../feature-flags"

/**
 * Client-side hook for feature flags
 *
 * This hook reads feature flags from environment variables (NEXT_PUBLIC_*)
 * and provides reactive updates if flags change.
 *
 * Usage:
 * ```tsx
 * const isDarkModeEnabled = useFeature("userDarkMode")
 * const flags = useFeatures(["socialAuth", "twoFactorAuth"])
 * ```
 */

// Client-side feature flag values (from NEXT_PUBLIC_ env vars)
const clientFeatureFlags: Partial<FeatureFlags> = {
  socialAuth: process.env.NEXT_PUBLIC_FEATURE_SOCIAL_AUTH === "true",
  twoFactorAuth: process.env.NEXT_PUBLIC_FEATURE_2FA === "true",
  maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "false",
  userDarkMode: true, // Default enabled
  dashboardAnalytics: true,
  dashboardCharts: true,
  userProfileEditing: true,
}

/**
 * Hook to get a single feature flag value
 */
export function useFeature(flag: FeatureFlag): boolean {
  const [isEnabled, setIsEnabled] = useState<boolean>(
    clientFeatureFlags[flag] ?? false
  )

  useEffect(() => {
    // In production, you could poll an API or use WebSocket for real-time updates
    setIsEnabled(clientFeatureFlags[flag] ?? false)
  }, [flag])

  return isEnabled
}

/**
 * Hook to get multiple feature flags at once
 */
export function useFeatures(
  flags: FeatureFlag[]
): Record<FeatureFlag, boolean> {
  const [featureStates, setFeatureStates] = useState<
    Record<FeatureFlag, boolean>
  >(() => {
    return flags.reduce(
      (acc, flag) => {
        acc[flag] = clientFeatureFlags[flag] ?? false
        return acc
      },
      {} as Record<FeatureFlag, boolean>
    )
  })

  useEffect(() => {
    const states = flags.reduce(
      (acc, flag) => {
        acc[flag] = clientFeatureFlags[flag] ?? false
        return acc
      },
      {} as Record<FeatureFlag, boolean>
    )
    setFeatureStates(states)
  }, [flags])

  return featureStates
}

/**
 * Hook to get all feature flags
 */
export function useAllFeatures(): Partial<FeatureFlags> {
  return clientFeatureFlags
}
