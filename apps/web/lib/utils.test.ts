import {describe, it, expect} from "vitest"
import {cn} from "./utils"

describe("cn (className utility)", () => {
  it("merges class names correctly", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2")
  })

  it("handles conditional classes", () => {
    expect(cn("base-class", true && "conditional-class")).toBe(
      "base-class conditional-class"
    )
    expect(cn("base-class", false && "conditional-class")).toBe("base-class")
  })

  it("merges Tailwind conflicting classes correctly", () => {
    // twMerge should resolve conflicts, keeping the last value
    expect(cn("px-4", "px-6")).toBe("px-6")
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("handles arrays of class names", () => {
    expect(cn(["px-4", "py-2"])).toBe("px-4 py-2")
    expect(cn(["px-4", "py-2"], "text-lg")).toBe("px-4 py-2 text-lg")
  })

  it("handles objects with boolean values", () => {
    expect(
      cn({
        "base-class": true,
        "active-class": true,
        "hidden-class": false,
      })
    ).toBe("base-class active-class")
  })

  it("handles undefined and null values", () => {
    expect(cn("base-class", undefined, null)).toBe("base-class")
  })

  it("handles empty inputs", () => {
    expect(cn()).toBe("")
    expect(cn("")).toBe("")
  })

  it("handles complex nested conditions", () => {
    const isActive = true
    const isDisabled = false
    const variant = "primary"

    const result = cn(
      "base-class",
      isActive && "active",
      isDisabled && "disabled",
      variant === "primary" && "bg-primary text-white",
      variant === "secondary" && "bg-secondary"
    )

    expect(result).toBe("base-class active bg-primary text-white")
  })

  it("handles Tailwind responsive classes", () => {
    expect(cn("px-4", "md:px-6", "lg:px-8")).toBe("px-4 md:px-6 lg:px-8")
  })

  it("handles Tailwind pseudo-class modifiers", () => {
    expect(cn("bg-blue-500", "hover:bg-blue-600", "focus:bg-blue-700")).toBe(
      "bg-blue-500 hover:bg-blue-600 focus:bg-blue-700"
    )
  })
})
