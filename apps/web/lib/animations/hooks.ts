"use client"

import {useEffect, useState, useRef} from "react"
import {useInView, useAnimation, type AnimationControls} from "framer-motion"

/**
 * Animation Hooks
 *
 * Custom hooks for common animation patterns with Framer Motion
 */

/**
 * Hook to trigger animation when element enters viewport
 *
 * Usage:
 * const {ref, controls} = useAnimateOnView()
 * <motion.div ref={ref} animate={controls} initial="hidden" variants={fadeIn}>
 */
export function useAnimateOnView(options?: {
  threshold?: number
  triggerOnce?: boolean
}): {
  ref: React.RefObject<HTMLDivElement>
  controls: AnimationControls
  isInView: boolean
} {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once: options?.triggerOnce ?? true,
    amount: options?.threshold ?? 0.2,
  })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else if (!options?.triggerOnce) {
      controls.start("hidden")
    }
  }, [isInView, controls, options?.triggerOnce])

  return {ref, controls, isInView}
}

/**
 * Hook to create a count-up animation for numbers
 *
 * Usage:
 * const count = useCountUp(1000, 2000) // Animates from 1000 to 2000
 */
export function useCountUp(
  end: number,
  duration: number = 2000,
  start: number = 0
): number {
  const [count, setCount] = useState(start)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)

      setCount(Math.floor(progress * (end - start) + start))

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }, [end, start, duration])

  return count
}

/**
 * Hook to detect reduced motion preference
 *
 * Usage:
 * const prefersReducedMotion = useReducedMotion()
 * <motion.div animate={prefersReducedMotion ? {} : animations}>
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Hook for sequential animations with delay
 *
 * Usage:
 * const {ref, isInView} = useSequentialAnimation()
 * <motion.div ref={ref} animate={isInView ? "visible" : "hidden"}>
 */
export function useSequentialAnimation(delay: number = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {once: true, amount: 0.2})
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        setShouldAnimate(true)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [isInView, delay])

  return {ref, isInView: shouldAnimate}
}
