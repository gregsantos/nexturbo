import {cn} from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  spacing?: "sm" | "default" | "lg" | "none"
  className?: string
}

export function Section({
  children,
  spacing = "default",
  className,
}: SectionProps) {
  return (
    <section
      className={cn(
        {
          "space-y-4": spacing === "sm",
          "space-y-6 sm:space-y-8": spacing === "default",
          "space-y-8 sm:space-y-10 lg:space-y-12": spacing === "lg",
        },
        className
      )}
    >
      {children}
    </section>
  )
}
