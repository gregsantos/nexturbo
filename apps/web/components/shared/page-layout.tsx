import {cn} from "@/lib/utils"
import {Container} from "./container"

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  containerSize?: "default" | "narrow" | "wide" | "full"
  className?: string
}

export function PageLayout({
  children,
  title,
  description,
  containerSize = "default",
  className,
}: PageLayoutProps) {
  return (
    <Container size={containerSize} className={className}>
      <div className='space-y-6 py-6 sm:space-y-8 sm:py-8 lg:py-12'>
        {(title || description) && (
          <div className='space-y-2 sm:space-y-3'>
            {title && (
              <h1 className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
                {title}
              </h1>
            )}
            {description && (
              <p className='text-sm text-muted-foreground sm:text-base'>
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </Container>
  )
}
