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
  const sizeClasses = {
    default: "max-w-7xl",
    narrow: "max-w-3xl",
    wide: "max-w-[1400px]",
    full: "max-w-none",
  }

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}
