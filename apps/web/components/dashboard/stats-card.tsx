interface StatsCardProps {
  title: string
  value: string
  description: string
}

export function StatsCard({title, value, description}: StatsCardProps) {
  return (
    <div className='rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:bg-accent/50 sm:p-6'>
      <div className='flex flex-col space-y-1 sm:space-y-2'>
        <p className='text-xs font-medium text-muted-foreground sm:text-sm'>
          {title}
        </p>
        <p className='text-xl font-bold sm:text-2xl lg:text-3xl'>{value}</p>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </div>
    </div>
  )
}
