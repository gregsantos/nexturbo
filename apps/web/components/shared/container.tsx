import {cn} from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode
  size?: "default" | "narrow" | "wide" | "full"
  className?: string
}

export function Container({
  children,
  size = "default",
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        {
          "max-w-7xl": size === "default",
          "max-w-3xl": size === "narrow",
          "max-w-[1400px]": size === "wide",
          "max-w-none": size === "full",
        },
        className
      )}
    >
      {children}
    </div>
  )
}

