interface Activity {
  id: string
  title: string
  description: string
  timestamp: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({activities}: RecentActivityProps) {
  return (
    <div className='rounded-lg border bg-card p-4 sm:p-6'>
      <h3 className='mb-3 text-base font-semibold sm:mb-4 sm:text-lg'>
        Recent Activity
      </h3>
      <div className='space-y-3 sm:space-y-4'>
        {activities.map(activity => (
          <div
            key={activity.id}
            className='flex flex-col space-y-1 border-b border-border/40 pb-3 last:border-0 last:pb-0 sm:pb-4'
          >
            <p className='text-sm font-medium sm:text-base'>{activity.title}</p>
            <p className='text-xs text-muted-foreground sm:text-sm'>
              {activity.description}
            </p>
            <p className='text-xs text-muted-foreground'>
              {new Date(activity.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
