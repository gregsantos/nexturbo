import {cn} from "@/lib/utils"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: React.ReactNode
  footer?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function AuthLayout({
  children,
  title,
  description,
  footer,
  icon,
  className,
}: AuthLayoutProps) {
  return (
    <div className='flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
      <div className={cn("w-full max-w-md space-y-6 sm:space-y-8", className)}>
        {icon && <div className='flex justify-center'>{icon}</div>}

        <div className='space-y-2 text-center sm:space-y-3'>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
            {title}
          </h1>
          <p className='text-sm text-muted-foreground sm:text-base'>
            {description}
          </p>
        </div>

        {children}

        {footer && (
          <div className='text-center text-sm sm:text-base'>{footer}</div>
        )}
      </div>
    </div>
  )
}

