interface StatsCardProps {
  title: string
  value: string
  description: string
}

export function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground">
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
